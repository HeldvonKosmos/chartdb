import { useChartDB } from '@/hooks/use-chartdb';
import { useConfig } from '@/hooks/use-config';
import { useDialog } from '@/hooks/use-dialog';
import { useFullScreenLoader } from '@/hooks/use-full-screen-spinner';
import { useRedoUndoStack } from '@/hooks/use-redo-undo-stack';
import { useStorage } from '@/hooks/use-storage';
import type { Diagram } from '@/lib/domain/diagram';
import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { diagramFromJSONInput } from '@/lib/export-import-utils';
import { AUTO_LOAD_API_ENDPOINT, AUTO_LOAD_JSON } from '@/lib/env';

export const useDiagramLoader = () => {
    const [initialDiagram, setInitialDiagram] = useState<Diagram | undefined>();
    const { diagramId } = useParams<{ diagramId: string }>();
    const { config } = useConfig();
    const { loadDiagram, currentDiagram } = useChartDB();
    const { resetRedoStack, resetUndoStack } = useRedoUndoStack();
    const { showLoader, hideLoader } = useFullScreenLoader();
    const { openCreateDiagramDialog, openOpenDiagramDialog } = useDialog();
    const navigate = useNavigate();
    const { listDiagrams, addDiagram, deleteDiagram } = useStorage();
    const hasAutoLoaded = useRef(false);

    useEffect(() => {
        const loadDefaultDiagram = async () => {
            if (AUTO_LOAD_JSON && !hasAutoLoaded.current) {
                hasAutoLoaded.current = true;
                try {
                    // Delete all cached diagrams
                    const diagramsToDelete = await listDiagrams();
                    if (diagramsToDelete.length > 0) {
                        await Promise.all(diagramsToDelete.map(d => deleteDiagram(d.id)));
                    }
                    // Get json from backend to add diagrams
                    const response = await fetch(AUTO_LOAD_API_ENDPOINT);
                    if (!response.ok) {
                        throw new Error(`API request failed: ${response.statusText}`);
                    }
                    const jsonString = await response.text();
                    const diagram = diagramFromJSONInput(jsonString);

                    // When auto-loading, remove schema information to simplify the view.
                    diagram.tables?.forEach(table => {
                        table.schema = undefined;
                    });
                    diagram.relationships?.forEach(rel => {
                        rel.sourceSchema = undefined;
                        rel.targetSchema = undefined;
                    });
                    diagram.dependencies?.forEach(dep => {
                        dep.schema = undefined;
                        dep.dependentSchema = undefined;
                    });
                    diagram.customTypes?.forEach(ct => {
                        ct.schema = undefined;
                    });

                    // Render the diagram
                    await addDiagram({ diagram });
                    const init_diagram = await loadDiagram(diagram.id);
                    setInitialDiagram(init_diagram);
                    //navigate(`/diagrams/${diagram.id}`);
                } catch (error) {
                    console.error('Failed to auto-load diagram from JSON API:', error);
                    openCreateDiagramDialog({ canClose: false });
                }
                return;
            } else if (!AUTO_LOAD_JSON && !hasAutoLoaded.current) {
                if (diagramId) {
                    setInitialDiagram(undefined);
                    showLoader();
                    resetRedoStack();
                    resetUndoStack();
                    const diagram = await loadDiagram(diagramId);
                    if (!diagram) {
                        openOpenDiagramDialog({ canClose: false });
                        hideLoader();
                        return;
                    }

                    setInitialDiagram(diagram);
                    hideLoader();

                    return;
                } else if (!diagramId && config.defaultDiagramId) {
                    const diagram = await loadDiagram(config.defaultDiagramId);
                    if (diagram) {
                        navigate(`/diagrams/${config.defaultDiagramId}`);

                        return;
                    }
                }
                const diagrams = await listDiagrams();

                if (diagrams.length > 0) {
                    openOpenDiagramDialog({ canClose: false });
                } else {
                    openCreateDiagramDialog();
                }
            }
        };
        loadDefaultDiagram();
    }, [
        config,
        diagramId,
        currentDiagram?.id,
        addDiagram,
        deleteDiagram,
        navigate,
        showLoader,
        hideLoader,
        openCreateDiagramDialog,
        openOpenDiagramDialog,
        loadDiagram,
        listDiagrams,
        resetRedoStack,
        resetUndoStack,
    ]);

    return { initialDiagram };
};
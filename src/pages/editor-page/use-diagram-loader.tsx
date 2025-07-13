import { useChartDB } from '@/hooks/use-chartdb';
import { useConfig } from '@/hooks/use-config';
import { useDialog } from '@/hooks/use-dialog';
import { useFullScreenLoader } from '@/hooks/use-full-screen-spinner';
import { useStorage } from '@/hooks/use-storage'; // Ensure useStorage is imported
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
    ]);

    return { initialDiagram };
};
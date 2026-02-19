/**
 * RecentProjects — Grid of recently used project cards
 */

import { useState } from 'react';

import { useNavigate } from '@tanstack/react-router';
import { FolderOpen, Loader2, Plus, Wand2 } from 'lucide-react';

import { PROJECT_VIEWS, projectViewPath } from '@shared/constants';

import { cn, formatRelativeTime, truncate } from '@renderer/shared/lib/utils';
import { useLayoutStore } from '@renderer/shared/stores';

import {
  AddProjectDialog,
  CreateProjectWizard,
  SetupProgressModal,
  useProjects,
  useSelectDirectory,
} from '@features/projects';

export function RecentProjects() {
  const navigate = useNavigate();
  const { data: projects, isLoading } = useProjects();
  const { addProjectTab } = useLayoutStore();
  const selectDirectory = useSelectDirectory();

  // Dialog state
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedFolderPath, setSelectedFolderPath] = useState('');
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [setupProjectId, setSetupProjectId] = useState('');
  const [createWizardOpen, setCreateWizardOpen] = useState(false);

  function handleOpenProject(projectId: string) {
    addProjectTab(projectId);
    void navigate({ to: projectViewPath(projectId, PROJECT_VIEWS.TASKS) });
  }

  async function handleAddProject() {
    const result = await selectDirectory.mutateAsync();
    if (result.path) {
      setSelectedFolderPath(result.path);
      setShowAddDialog(true);
    }
  }

  function handleSetupStarted(projectId: string) {
    setShowAddDialog(false);
    setSetupProjectId(projectId);
    setShowProgressModal(true);
  }

  function handleSetupComplete() {
    setShowProgressModal(false);
    if (setupProjectId.length > 0) {
      addProjectTab(setupProjectId);
      void navigate({ to: projectViewPath(setupProjectId, PROJECT_VIEWS.TASKS) });
    }
  }

  function handleProjectCreated(projectId: string) {
    setCreateWizardOpen(false);
    setSetupProjectId(projectId);
    setShowProgressModal(true);
  }

  if (isLoading) {
    return (
      <div className="bg-card border-border flex items-center justify-center rounded-lg border p-8">
        <Loader2 className="text-muted-foreground h-5 w-5 animate-spin" />
      </div>
    );
  }

  const projectList = projects ?? [];

  return (
    <div className="bg-card border-border rounded-lg border p-4">
      <h2 className="text-foreground mb-3 text-sm font-semibold">Recent Projects</h2>

      {projectList.length > 0 ? (
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
          {projectList.map((project) => (
            <button
              key={project.id}
              className={cn(
                'border-border flex items-start gap-3 rounded-md border p-3 text-left',
                'hover:bg-accent transition-colors',
              )}
              onClick={() => handleOpenProject(project.id)}
            >
              <FolderOpen className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm font-medium">{project.name}</p>
                <p className="text-muted-foreground truncate text-xs">
                  {truncate(project.path, 40)}
                </p>
                <p className="text-muted-foreground mt-1 text-xs">
                  {formatRelativeTime(project.updatedAt)}
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center">
          <FolderOpen className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
          <p className="text-muted-foreground text-xs">No projects yet</p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <button
              type="button"
              className={cn(
                'bg-primary text-primary-foreground flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium',
                'hover:bg-primary/90 transition-colors',
              )}
              onClick={handleAddProject}
            >
              <Plus className="h-3.5 w-3.5" />
              Add Project
            </button>
            <button
              type="button"
              className={cn(
                'border-border text-foreground flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium',
                'hover:bg-accent transition-colors',
              )}
              onClick={() => setCreateWizardOpen(true)}
            >
              <Wand2 className="h-3.5 w-3.5" />
              New Project
            </button>
          </div>
        </div>
      )}

      <AddProjectDialog
        folderPath={selectedFolderPath}
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onSetupStarted={handleSetupStarted}
      />

      <SetupProgressModal
        open={showProgressModal}
        projectId={setupProjectId}
        onClose={() => setShowProgressModal(false)}
        onComplete={handleSetupComplete}
      />

      <CreateProjectWizard
        open={createWizardOpen}
        onClose={() => setCreateWizardOpen(false)}
        onProjectCreated={handleProjectCreated}
      />
    </div>
  );
}

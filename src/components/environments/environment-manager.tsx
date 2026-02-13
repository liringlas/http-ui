"use client";

import { useState } from "react";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useEnvironments,
  useCreateEnvironment,
  useDeleteEnvironment,
  useUpdateEnvironment,
  useVariables,
  useCreateVariable,
  useDeleteVariable,
  useUpdateVariable,
} from "@/hooks/use-environments";
import { Variable } from "@/types";

export function EnvironmentManager() {
  const [open, setOpen] = useState(false);
  const [newEnvName, setNewEnvName] = useState("");
  const [showNewEnv, setShowNewEnv] = useState(false);
  const { data: environments = [] } = useEnvironments();
  const { data: globalVariables = [] } = useVariables();
  const createEnvironment = useCreateEnvironment();
  const deleteEnvironment = useDeleteEnvironment();

  const handleCreateEnvironment = () => {
    if (newEnvName.trim()) {
      createEnvironment.mutate({ name: newEnvName.trim() });
      setNewEnvName("");
      setShowNewEnv(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="cursor-pointer">
          Manage Environments
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Environment Manager</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="environments" className="mt-4">
          <TabsList>
            <TabsTrigger value="environments">Environments</TabsTrigger>
            <TabsTrigger value="globals">Global Variables</TabsTrigger>
          </TabsList>

          <TabsContent value="environments" className="mt-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {environments.length} environment(s)
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewEnv(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Environment
                </Button>
              </div>

              {showNewEnv && (
                <div className="flex items-center gap-2 p-2 border rounded">
                  <Input
                    placeholder="Environment name"
                    value={newEnvName}
                    onChange={(e) => setNewEnvName(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleCreateEnvironment()
                    }
                    autoFocus
                  />
                  <Button size="sm" onClick={handleCreateEnvironment}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setShowNewEnv(false);
                      setNewEnvName("");
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {environments.map((env) => (
                    <EnvironmentCard
                      key={env.id}
                      environment={env}
                      onDelete={() => deleteEnvironment.mutate(env.id)}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="globals" className="mt-4">
            <VariableEditor variables={globalVariables} environmentId={null} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function EnvironmentCard({
  environment,
  onDelete,
}: {
  environment: { id: string; name: string; variables: Variable[] };
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(environment.name);
  const updateEnvironment = useUpdateEnvironment();

  const handleSave = () => {
    if (name.trim() && name !== environment.name) {
      updateEnvironment.mutate({
        id: environment.id,
        data: { name: name.trim() },
      });
    }
    setEditing(false);
  };

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        {editing ? (
          <div className="flex items-center gap-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              autoFocus
            />
            <Button size="sm" onClick={handleSave}>
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setEditing(false);
                setName(environment.name);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-medium">{environment.name}</span>
            <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        )}
        <Button size="sm" variant="destructive" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <VariableEditor
        variables={environment.variables}
        environmentId={environment.id}
      />
    </div>
  );
}

function VariableEditor({
  variables,
  environmentId,
}: {
  variables: Variable[];
  environmentId: string | null;
}) {
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const createVariable = useCreateVariable();
  const deleteVariable = useDeleteVariable();
  const updateVariable = useUpdateVariable();

  const handleAdd = () => {
    if (newKey.trim()) {
      createVariable.mutate({
        key: newKey.trim(),
        value: newValue,
        environmentId: environmentId || undefined,
      });
      setNewKey("");
      setNewValue("");
    }
  };

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-muted-foreground mb-2">
        Variables ({variables.length})
      </div>

      {variables.map((variable) => (
        <VariableRow
          key={variable.id}
          variable={variable}
          onUpdate={(data) => updateVariable.mutate({ id: variable.id, data })}
          onDelete={() => deleteVariable.mutate(variable.id)}
        />
      ))}

      <div className="flex items-center gap-2 pt-2">
        <Input
          placeholder="Key"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          className="flex-1"
        />
        <Input
          placeholder="Value"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          className="flex-1"
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        />
        <Button size="sm" onClick={handleAdd} disabled={!newKey.trim()}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function VariableRow({
  variable,
  onUpdate,
  onDelete,
}: {
  variable: Variable;
  onUpdate: (data: { key?: string; value?: string }) => void;
  onDelete: () => void;
}) {
  const [key, setKey] = useState(variable.key);
  const [value, setValue] = useState(variable.value);

  const handleBlur = () => {
    if (key !== variable.key || value !== variable.value) {
      onUpdate({ key, value });
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        value={key}
        onChange={(e) => setKey(e.target.value)}
        onBlur={handleBlur}
        className="flex-1 font-mono text-sm"
      />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
        className="flex-1 font-mono text-sm"
      />
      <Button size="sm" variant="ghost" onClick={onDelete}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}

"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from "@/store";
import { useEnvironments } from "@/hooks/use-environments";
import { EnvironmentManager } from "@/components/environments/environment-manager";
import Image from "next/image";
import ImageLogo from "public/image_http_ui_logo.png";

export function Header() {
  const { addTab, activeEnvironmentId, setActiveEnvironment } = useStore();
  const { data: environments = [] } = useEnvironments();

  return (
    <header className="flex h-12 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Image
            src={ImageLogo}
            alt="HTTP UI Logo"
            width={753 / 6}
            height={248 / 6}
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => addTab()}
          className="gap-2 h-8 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          New Request
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <Select
          value={activeEnvironmentId || "none"}
          onValueChange={(value) =>
            setActiveEnvironment(value === "none" ? null : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="No Environment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No Environment</SelectItem>
            {environments.map((env) => (
              <SelectItem key={env.id} value={env.id}>
                {env.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <EnvironmentManager />
      </div>
    </header>
  );
}

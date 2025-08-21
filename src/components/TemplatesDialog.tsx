import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Edit2, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AdTemplate } from "@/types/adTemplate";

interface TemplatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  templates: AdTemplate[];
  onTemplateApplied: (template: AdTemplate) => void;
  onTemplatesChanged: () => void;
}

export function TemplatesDialog({ 
  open, 
  onOpenChange, 
  templates, 
  onTemplateApplied,
  onTemplatesChanged 
}: TemplatesDialogProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const { toast } = useToast();

  const handleApply = (template: AdTemplate) => {
    onTemplateApplied(template);
    onOpenChange(false);
    toast({
      title: "Template applied",
      description: "Only character selection can be changed.",
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;

    try {
      const { error } = await supabase.functions.invoke('templates', {
        body: { action: 'delete', id }
      });

      if (error) throw error;

      onTemplatesChanged();
      toast({
        title: "Template deleted",
      });
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "Error",
        description: "Failed to delete template",
        variant: "destructive",
      });
    }
  };

  const handleRename = async (id: string) => {
    if (!editName.trim()) return;

    try {
      const { error } = await supabase.functions.invoke('templates', {
        body: { action: 'rename', id, name: editName.trim() }
      });

      if (error) throw error;

      setEditingId(null);
      setEditName("");
      onTemplatesChanged();
      toast({
        title: "Template renamed",
      });
    } catch (error) {
      console.error('Error renaming template:', error);
      toast({
        title: "Error",
        description: "Failed to rename template",
        variant: "destructive",
      });
    }
  };

  const startEdit = (template: AdTemplate) => {
    setEditingId(template.id);
    setEditName(template.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Templates ({templates.length})</DialogTitle>
        </DialogHeader>
        
        {templates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No templates saved yet. Save your first template from the wizard.
          </div>
        ) : (
          <div className="space-y-3">
            {templates.map((template) => (
              <Card key={template.id} className="p-4">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {editingId === template.id ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="flex-1"
                            placeholder="Template name"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleRename(template.id);
                              if (e.key === 'Escape') cancelEdit();
                            }}
                          />
                          <Button size="sm" onClick={() => handleRename(template.id)}>
                            Save
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEdit}>
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <h3 className="font-medium">{template.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(template.created_at).toLocaleDateString()}
                            </div>
                            <Badge variant="outline">
                              {template.payload.brand} • {template.payload.length}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {editingId !== template.id && (
                      <div className="flex items-center gap-2">
                        <Button onClick={() => handleApply(template)}>
                          Apply
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => startEdit(template)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(template.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
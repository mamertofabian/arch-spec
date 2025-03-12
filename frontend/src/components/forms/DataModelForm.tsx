import React, { useState, useEffect } from "react";
import { dataModelService } from "../../services/dataModelService";
import Button from "../ui/Button";
import Input from "../ui/Input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Label } from "../ui/label";
import { Edit, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select-advanced";
import Card from "../ui/Card";
import { Badge } from "../ui/badge";
import { Checkbox } from "../ui/checkbox";
import {
  DataModel,
  Entity,
  Relationship,
  EntityField,
} from "../../types/templates";
import { Textarea } from "../ui/textarea";
interface DataModelFormProps {
  initialData?: DataModel;
  projectId?: string;
  onSuccess?: (dataModel: DataModel) => void;
}

export default function DataModelForm({
  initialData,
  projectId,
  onSuccess,
}: DataModelFormProps) {
  const [dataModel, setDataModel] = useState<DataModel>({
    entities: [],
    relationships: [],
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // State for the entity form
  const [isEditingEntity, setIsEditingEntity] = useState(false);
  const [editingEntityIndex, setEditingEntityIndex] = useState<number | null>(
    null
  );
  const [entityForm, setEntityForm] = useState<Entity>({
    name: "",
    description: "",
    fields: [],
  });

  // State for the field form
  const [isAddingField, setIsAddingField] = useState(false);
  const [editingFieldIndex, setEditingFieldIndex] = useState<number | null>(
    null
  );
  const [fieldForm, setFieldForm] = useState<EntityField>({
    name: "",
    type: "string",
  });

  // State for the relationship form
  const [isEditingRelationship, setIsEditingRelationship] = useState(false);
  const [editingRelationshipIndex, setEditingRelationshipIndex] = useState<
    number | null
  >(null);
  const [relationshipForm, setRelationshipForm] = useState<Relationship>({
    type: "oneToOne",
    from_entity: "",
    to_entity: "",
    field: "",
  });

  // State for the delete dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [entityToDelete, setEntityToDelete] = useState<number | null>(null);

  // Field types for dropdown selection
  const fieldTypes = [
    "string",
    "text",
    "integer",
    "float",
    "decimal",
    "boolean",
    "date",
    "timestamp",
    "uuid",
    "jsonb",
    "enum",
  ];

  // Relationship types for dropdown selection
  const relationshipTypes = [
    "oneToOne",
    "oneToMany",
    "manyToOne",
    "manyToMany",
  ];

  useEffect(() => {
    if (initialData) {
      setDataModel(initialData);
    } else if (projectId) {
      fetchDataModel();
    }
  }, [initialData, projectId]);

  const fetchDataModel = async () => {
    if (!projectId) return;

    setLoading(true);
    setError(null);

    try {
      const dataModelData = await dataModelService.getDataModel(projectId);
      if (dataModelData) {
        setDataModel(dataModelData);
      } else {
        setDataModel({
          entities: [],
          relationships: [],
        });
      }
    } catch (err) {
      console.error("Error loading data model:", err);
      setError("Failed to load data model. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Entity form handlers
  const handleEntityFormChange = (field: string, value: string) => {
    setEntityForm({
      ...entityForm,
      [field]: value,
    });
  };

  const validateEntityForm = () => {
    if (!entityForm.name.trim()) {
      setError("Entity name is required");
      return false;
    }
    if (!entityForm.description.trim()) {
      setError("Entity description is required");
      return false;
    }
    return true;
  };

  const handleAddEntity = () => {
    if (!validateEntityForm()) return;

    setDataModel({
      ...dataModel,
      entities: [
        ...dataModel.entities,
        {
          ...entityForm,
          fields: entityForm.fields || [],
        },
      ],
    });

    resetEntityForm();
    setSuccess("Entity added successfully");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleEditEntity = () => {
    if (!validateEntityForm() || editingEntityIndex === null) return;

    const updatedEntities = [...dataModel.entities];
    updatedEntities[editingEntityIndex] = {
      ...entityForm,
    };

    setDataModel({
      ...dataModel,
      entities: updatedEntities,
    });

    resetEntityForm();
    setEditingEntityIndex(null);
    setIsEditingEntity(false);
    setSuccess("Entity updated successfully");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleStartEditEntity = (index: number) => {
    setEntityForm(dataModel.entities[index]);
    setEditingEntityIndex(index);
    setIsEditingEntity(true);
  };

  const handleDeleteEntity = (index: number) => {
    // Check if entity is used in any relationships before deleting
    const entityName = dataModel.entities[index].name;
    const isUsedInRelationship = dataModel.relationships.some(
      (rel) => rel.from_entity === entityName || rel.to_entity === entityName
    );

    if (isUsedInRelationship) {
      setError(
        `Cannot delete entity '${entityName}' as it is used in relationships. Remove those relationships first.`
      );
      setTimeout(() => setError(null), 5000);
      return;
    }

    const updatedEntities = [...dataModel.entities];
    updatedEntities.splice(index, 1);

    setDataModel({
      ...dataModel,
      entities: updatedEntities,
    });

    setSuccess("Entity deleted successfully");
    setTimeout(() => setSuccess(null), 3000);
  };

  const resetEntityForm = () => {
    setEntityForm({
      name: "",
      description: "",
      fields: [],
    });
    setIsEditingEntity(false);
    setEditingEntityIndex(null);
    setError(null);
  };

  // Field form handlers
  const handleFieldFormChange = (field: string, value: any) => {
    // Convert numeric default value to string if needed
    if (field === "default" && typeof value === "number") {
      value = value.toString();
    }

    // Ensure all non-string default values are converted to strings
    if (
      field === "default" &&
      value !== null &&
      value !== undefined &&
      typeof value !== "string"
    ) {
      value = String(value);
    }

    setFieldForm({
      ...fieldForm,
      [field]: value,
    });
  };

  const validateFieldForm = () => {
    if (!fieldForm.name.trim()) {
      setError("Field name is required");
      return false;
    }
    if (!fieldForm.type) {
      setError("Field type is required");
      return false;
    }
    return true;
  };

  const handleAddField = () => {
    if (!validateFieldForm()) return;

    const updatedEntityForm = {
      ...entityForm,
      fields: [...(entityForm.fields || []), { ...fieldForm }],
    };

    setEntityForm(updatedEntityForm);
    resetFieldForm();
  };

  const handleEditField = () => {
    if (!validateFieldForm() || editingFieldIndex === null) return;

    const updatedFields = [...entityForm.fields];
    updatedFields[editingFieldIndex] = { ...fieldForm };

    setEntityForm({
      ...entityForm,
      fields: updatedFields,
    });

    resetFieldForm();
  };

  const handleStartEditField = (index: number) => {
    setFieldForm(entityForm.fields[index]);
    setEditingFieldIndex(index);
    setIsAddingField(true);
  };

  const handleDeleteField = (index: number) => {
    const updatedFields = [...entityForm.fields];
    updatedFields.splice(index, 1);

    setEntityForm({
      ...entityForm,
      fields: updatedFields,
    });
  };

  const resetFieldForm = () => {
    setFieldForm({
      name: "",
      type: "string",
    });
    setIsAddingField(false);
    setEditingFieldIndex(null);
  };

  // Relationship form handlers
  const handleRelationshipFormChange = (field: string, value: string) => {
    setRelationshipForm({
      ...relationshipForm,
      [field]: value,
    });
  };

  const validateRelationshipForm = () => {
    if (!relationshipForm.type) {
      setError("Relationship type is required");
      return false;
    }
    if (!relationshipForm.from_entity) {
      setError("Source entity is required");
      return false;
    }
    if (!relationshipForm.to_entity) {
      setError("Target entity is required");
      return false;
    }
    if (!relationshipForm.field) {
      setError("Relationship field is required");
      return false;
    }
    return true;
  };

  const handleAddRelationship = () => {
    if (!validateRelationshipForm()) return;

    setDataModel({
      ...dataModel,
      relationships: [...dataModel.relationships, { ...relationshipForm }],
    });

    resetRelationshipForm();
    setSuccess("Relationship added successfully");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleEditRelationship = () => {
    if (!validateRelationshipForm() || editingRelationshipIndex === null)
      return;

    const updatedRelationships = [...dataModel.relationships];
    updatedRelationships[editingRelationshipIndex] = {
      ...relationshipForm,
    };

    setDataModel({
      ...dataModel,
      relationships: updatedRelationships,
    });

    resetRelationshipForm();
    setSuccess("Relationship updated successfully");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleStartEditRelationship = (index: number) => {
    setRelationshipForm(dataModel.relationships[index]);
    setEditingRelationshipIndex(index);
    setIsEditingRelationship(true);
  };

  const handleDeleteRelationship = (index: number) => {
    const updatedRelationships = [...dataModel.relationships];
    updatedRelationships.splice(index, 1);

    setDataModel({
      ...dataModel,
      relationships: updatedRelationships,
    });

    setSuccess("Relationship deleted successfully");
    setTimeout(() => setSuccess(null), 3000);
  };

  const resetRelationshipForm = () => {
    setRelationshipForm({
      type: "oneToOne",
      from_entity: "",
      to_entity: "",
      field: "",
    });
    setIsEditingRelationship(false);
    setEditingRelationshipIndex(null);
    setError(null);
  };

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId) {
      setError("Project ID is required to save the data model");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const updatedDataModel = await dataModelService.saveDataModel(
        projectId,
        dataModel
      );

      if (updatedDataModel) {
        setSuccess("Data model saved successfully");
        setTimeout(() => setSuccess(null), 3000);
        if (onSuccess) {
          onSuccess(updatedDataModel);
        }
      } else {
        setError("Failed to save data model. Please try again.");
      }
    } catch (err) {
      console.error("Error saving data model:", err);
      setError("Failed to save data model. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-3 rounded-md mb-4">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6">
              {/* Entities Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Entities</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditingEntity(!isEditingEntity)}
                  >
                    {isEditingEntity ? "Cancel" : "Add Entity"}
                  </Button>
                </div>

                {/* Entity Form */}
                {isEditingEntity && (
                  <Card className="p-4 space-y-4 border border-slate-200 dark:border-slate-700">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="entityName">Entity Name</Label>
                        <Input
                          id="entityName"
                          placeholder="User, Product, Order, etc."
                          value={entityForm.name}
                          onChange={(e) =>
                            handleEntityFormChange("name", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="entityDescription">Description</Label>
                        <Textarea
                          id="entityDescription"
                          placeholder="Describe this entity's purpose"
                          value={entityForm.description}
                          onChange={(e) =>
                            handleEntityFormChange(
                              "description",
                              e.target.value
                            )
                          }
                          rows={2}
                        />
                      </div>

                      {/* Fields Section within Entity Form */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <Label>Fields</Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setIsAddingField(!isAddingField)}
                          >
                            {isAddingField ? "Cancel" : "Add Field"}
                          </Button>
                        </div>

                        {/* Field Form */}
                        {isAddingField && (
                          <div className="p-3 border border-slate-200 dark:border-slate-700 rounded-md space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label htmlFor="fieldName">Field Name</Label>
                                <Input
                                  id="fieldName"
                                  placeholder="name, email, price, etc."
                                  value={fieldForm.name}
                                  onChange={(e) =>
                                    handleFieldFormChange(
                                      "name",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="fieldType">Field Type</Label>
                                <Select
                                  value={fieldForm.type}
                                  onValueChange={(value) =>
                                    handleFieldFormChange("type", value)
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {fieldTypes.map((type) => (
                                      <SelectItem key={type} value={type}>
                                        {type}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="required"
                                  checked={fieldForm.required || false}
                                  onCheckedChange={(checked) =>
                                    handleFieldFormChange(
                                      "required",
                                      checked === true
                                    )
                                  }
                                />
                                <Label htmlFor="required">Required</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="unique"
                                  checked={fieldForm.unique || false}
                                  onCheckedChange={(checked) =>
                                    handleFieldFormChange(
                                      "unique",
                                      checked === true
                                    )
                                  }
                                />
                                <Label htmlFor="unique">Unique</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="primaryKey"
                                  checked={fieldForm.primaryKey || false}
                                  onCheckedChange={(checked) =>
                                    handleFieldFormChange(
                                      "primaryKey",
                                      checked === true
                                    )
                                  }
                                />
                                <Label htmlFor="primaryKey">Primary Key</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  id="generated"
                                  checked={fieldForm.generated || false}
                                  onCheckedChange={(checked) =>
                                    handleFieldFormChange(
                                      "generated",
                                      checked === true
                                    )
                                  }
                                />
                                <Label htmlFor="generated">Generated</Label>
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="defaultValue">
                                Default Value (optional)
                              </Label>
                              <Input
                                id="defaultValue"
                                placeholder="Default value"
                                value={fieldForm.default?.toString() || ""}
                                onChange={(e) =>
                                  handleFieldFormChange(
                                    "default",
                                    e.target.value
                                  )
                                }
                              />
                            </div>

                            {fieldForm.type === "enum" && (
                              <div>
                                <Label htmlFor="enumValues">
                                  Enum Values (comma separated)
                                </Label>
                                <Input
                                  id="enumValues"
                                  placeholder="value1, value2, value3"
                                  value={fieldForm.enum?.join(", ") || ""}
                                  onChange={(e) => {
                                    const values = e.target.value
                                      .split(",")
                                      .map((v) => v.trim())
                                      .filter((v) => v);
                                    handleFieldFormChange("enum", values);
                                  }}
                                />
                              </div>
                            )}

                            <div className="flex justify-end space-x-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={resetFieldForm}
                              >
                                Cancel
                              </Button>
                              {editingFieldIndex !== null ? (
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={handleEditField}
                                >
                                  Update Field
                                </Button>
                              ) : (
                                <Button
                                  type="button"
                                  size="sm"
                                  onClick={handleAddField}
                                >
                                  Add Field
                                </Button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* List of Fields */}
                        {entityForm.fields && entityForm.fields.length > 0 ? (
                          <div className="border border-slate-200 dark:border-slate-700 rounded-md divide-y divide-slate-200 dark:divide-slate-700">
                            {entityForm.fields.map((field, idx) => (
                              <div
                                key={idx}
                                className="p-3 flex items-center justify-between"
                              >
                                <div>
                                  <div className="font-medium">
                                    {field.name}
                                  </div>
                                  <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center space-x-2">
                                    <Badge variant="outline">
                                      {field.type}
                                    </Badge>
                                    {field.required && (
                                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                        Required
                                      </Badge>
                                    )}
                                    {field.unique && (
                                      <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                        Unique
                                      </Badge>
                                    )}
                                    {field.primaryKey && (
                                      <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                                        PK
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleStartEditField(idx)}
                                  >
                                    <Edit size={16} />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteField(idx)}
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 border border-dashed border-slate-200 dark:border-slate-700 rounded-md">
                            <p className="text-slate-500 dark:text-slate-400">
                              No fields added yet. Add fields to define the
                              entity structure.
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={resetEntityForm}
                        >
                          Cancel
                        </Button>
                        {editingEntityIndex !== null ? (
                          <Button type="button" onClick={handleEditEntity}>
                            Update Entity
                          </Button>
                        ) : (
                          <Button type="button" onClick={handleAddEntity}>
                            Add Entity
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                )}

                {/* List of Entities */}
                {dataModel.entities.length > 0 ? (
                  <Accordion type="single" collapsible className="w-full">
                    {dataModel.entities.map((entity, idx) => (
                      <AccordionItem key={idx} value={`entity-${idx}`}>
                        <div className="flex items-center">
                          <AccordionTrigger className="flex-grow px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800">
                            <div className="flex items-center space-x-2">
                              <span>{entity.name}</span>
                              <Badge variant="outline" className="ml-2">
                                {entity.fields?.length || 0} fields
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <div className="flex mr-4 space-x-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleStartEditEntity(idx)}
                            >
                              <Edit size={16} />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEntityToDelete(idx);
                                    setIsDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash2 size={16} />
                                </Button>
                              </AlertDialogTrigger>
                              {isDeleteDialogOpen && entityToDelete === idx && (
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Delete {entity.name}?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete the entity
                                      and cannot be undone. Make sure this
                                      entity is not used in any relationships.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel
                                      onClick={() => {
                                        setIsDeleteDialogOpen(false);
                                        setEntityToDelete(null);
                                      }}
                                    >
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => {
                                        if (entityToDelete !== null) {
                                          handleDeleteEntity(entityToDelete);
                                        }
                                        setIsDeleteDialogOpen(false);
                                        setEntityToDelete(null);
                                      }}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              )}
                            </AlertDialog>
                          </div>
                        </div>
                        <AccordionContent className="px-4 py-2">
                          <div className="text-slate-600 dark:text-slate-300 mb-2">
                            {entity.description}
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm font-medium">Fields:</div>
                            {entity.fields && entity.fields.length > 0 ? (
                              <div className="grid grid-cols-1 gap-2">
                                {entity.fields.map((field, fieldIdx) => (
                                  <div
                                    key={fieldIdx}
                                    className="flex justify-between items-center p-2 bg-slate-50 dark:bg-slate-800 rounded-md"
                                  >
                                    <div>
                                      <span className="font-medium">
                                        {field.name}
                                      </span>
                                      <span className="ml-2 text-slate-500 dark:text-slate-400">
                                        ({field.type})
                                      </span>
                                      <div className="flex mt-1 space-x-1">
                                        {field.required && (
                                          <Badge
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            Required
                                          </Badge>
                                        )}
                                        {field.unique && (
                                          <Badge
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            Unique
                                          </Badge>
                                        )}
                                        {field.primaryKey && (
                                          <Badge
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            PK
                                          </Badge>
                                        )}
                                        {field.generated && (
                                          <Badge
                                            variant="outline"
                                            className="text-xs"
                                          >
                                            Generated
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-slate-500 dark:text-slate-400">
                                No fields defined for this entity.
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-700 rounded-md">
                    <p className="text-slate-500 dark:text-slate-400">
                      No entities defined yet. Add an entity to start building
                      your data model.
                    </p>
                  </div>
                )}
              </div>

              {/* Relationships Section */}
              <div className="space-y-4 pt-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Relationships</h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setIsEditingRelationship(!isEditingRelationship)
                    }
                    disabled={dataModel.entities.length < 2}
                  >
                    {isEditingRelationship ? "Cancel" : "Add Relationship"}
                  </Button>
                </div>

                {dataModel.entities.length < 2 && (
                  <div className="text-amber-600 dark:text-amber-400 text-sm">
                    You need at least two entities to create relationships.
                  </div>
                )}

                {/* Relationship Form */}
                {isEditingRelationship && (
                  <Card className="p-4 space-y-4 border border-slate-200 dark:border-slate-700">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="relationType">Relationship Type</Label>
                        <Select
                          value={relationshipForm.type}
                          onValueChange={(value) =>
                            handleRelationshipFormChange("type", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            {relationshipTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="field">Foreign Key Field</Label>
                        <Input
                          id="field"
                          placeholder="e.g., user_id"
                          value={relationshipForm.field}
                          onChange={(e) =>
                            handleRelationshipFormChange(
                              "field",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="fromEntity">From Entity</Label>
                        <Select
                          value={relationshipForm.from_entity}
                          onValueChange={(value) =>
                            handleRelationshipFormChange("from_entity", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select entity" />
                          </SelectTrigger>
                          <SelectContent>
                            {dataModel.entities.map((entity) => (
                              <SelectItem key={entity.name} value={entity.name}>
                                {entity.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="toEntity">To Entity</Label>
                        <Select
                          value={relationshipForm.to_entity}
                          onValueChange={(value) =>
                            handleRelationshipFormChange("to_entity", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select entity" />
                          </SelectTrigger>
                          <SelectContent>
                            {dataModel.entities.map((entity) => (
                              <SelectItem key={entity.name} value={entity.name}>
                                {entity.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {relationshipForm.type === "manyToMany" && (
                        <div className="col-span-2">
                          <Label htmlFor="throughTable">
                            Through Table (for many-to-many)
                          </Label>
                          <Input
                            id="throughTable"
                            placeholder="e.g., user_roles"
                            value={relationshipForm.throughTable || ""}
                            onChange={(e) =>
                              handleRelationshipFormChange(
                                "throughTable",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={resetRelationshipForm}
                      >
                        Cancel
                      </Button>
                      {editingRelationshipIndex !== null ? (
                        <Button type="button" onClick={handleEditRelationship}>
                          Update Relationship
                        </Button>
                      ) : (
                        <Button type="button" onClick={handleAddRelationship}>
                          Add Relationship
                        </Button>
                      )}
                    </div>
                  </Card>
                )}

                {/* List of Relationships */}
                {dataModel.relationships.length > 0 ? (
                  <div className="border border-slate-200 dark:border-slate-700 rounded-md divide-y divide-slate-200 dark:divide-slate-700">
                    {dataModel.relationships.map((rel, idx) => (
                      <div
                        key={idx}
                        className="p-4 flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium flex items-center space-x-2">
                            <span>{rel.from_entity}</span>
                            <span className="text-slate-500 dark:text-slate-400">
                              {rel.type === "oneToOne" && "1:1"}
                              {rel.type === "oneToMany" && "1:n"}
                              {rel.type === "manyToOne" && "n:1"}
                              {rel.type === "manyToMany" && "n:m"}
                            </span>
                            <span>{rel.to_entity}</span>
                          </div>
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            Field: {rel.field}
                            {rel.throughTable && (
                              <span> (through {rel.throughTable})</span>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStartEditRelationship(idx)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteRelationship(idx)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border border-dashed border-slate-200 dark:border-slate-700 rounded-md">
                    <p className="text-slate-500 dark:text-slate-400">
                      No relationships defined yet. Relationships help connect
                      your entities.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-6">
                <Button
                  type="submit"
                  disabled={saving || !projectId}
                  className="w-full sm:w-auto"
                >
                  {saving ? (
                    <>
                      <span className="animate-spin mr-2">&#8987;</span>
                      Saving...
                    </>
                  ) : (
                    "Save Data Model"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

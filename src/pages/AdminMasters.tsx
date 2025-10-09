import { useState } from "react";
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import AdminNavigation from "@/components/AdminNavigation";

interface MasterRecord {
  id: string;
  [key: string]: any;
}

const initialExamLevels: MasterRecord[] = [
  { id: "1", name: "Intermediate", description: "Intermediate level", attempt_info: "", active: true },
  { id: "2", name: "Final", description: "Final level", attempt_info: "", active: true },
];

const initialSubjects: MasterRecord[] = [
  { id: "1", name: "Financial Accounting", code: "FA", exam_level_id: "1", description: "", default_thumbnail: "", recommended_hours: 100, tags: "", active: true },
];

const initialChapters: MasterRecord[] = [
  { id: "1", subject_id: "1", title: "AS-1", chapter_no: 1, short_description: "", topics: "", est_time_hours: 10, difficulty: 3, attachments: "", prerequisites: "", exam_weightage_pct: 10, active: true },
];

const initialTopics: MasterRecord[] = [
  { id: "1", chapter_id: "1", title: "Topic 1", est_time_minutes: 30, question_samples_count: 5 },
];

const initialBatches: MasterRecord[] = [
  { id: "1", name: "Batch 1", level_id: "1", academic_year: "2025", start_date: "2025-01-01", end_date: "2025-12-31", teacher_ids: "", student_count: 0, capacity: 50, tags: "", active: true },
];

const initialUsers: MasterRecord[] = [
  { id: "1", role: "student", name: "John Doe", email: "john@example.com", phone: "", registration_source: "", status: "active", created_at: new Date().toISOString(), last_login: new Date().toISOString() },
];

const initialTeachers: MasterRecord[] = [
  { id: "1", user_id: "1", qualifications: "", experience_years: 5, subjects: "", office_hours: "", bio: "", social_links: "" },
];

const initialFocusPresets: MasterRecord[] = [
  { id: "1", name: "Default 45/10", study_duration_min: 45, break_duration_min: 10, allow_pause_on_blur: true, icon: "", description: "", active: true },
];

const initialBadges: MasterRecord[] = [
  { id: "1", name: "7-Day Streak", icon_url: "", description: "", criteria_expression: "", points: 100, expiry_days: 0, auto_award: true, visible_to_students: true },
];

const initialNotificationTemplates: MasterRecord[] = [
  { id: "1", name: "Task Reminder", channel: "push", subject: "", body_template: "", default_send_timing: "", active: true },
];

const initialRubrics: MasterRecord[] = [
  { id: "1", name: "Basic Rubric", criteria: '[{"criteria_title":"Content","max_marks":10,"description":""}]' },
];

const initialLeaderboards: MasterRecord[] = [
  { id: "1", rule_name: "Weekly Streak", metric: "streaks", rank_window: "weekly", reward_points: 50 },
];

const initialLiveSessions: MasterRecord[] = [
  { id: "1", title: "GST Session", speaker_ids: "", date_time: new Date().toISOString(), duration: 60, platform: "", recording_url: "", access_type: "", attachments: "" },
];

const initialNotificationPrefs: MasterRecord[] = [
  { id: "1", default_channels: "push,email", frequency_presets: "daily", content_categories: "task_reminder" },
];

const AdminMasters = () => {
  const [examLevels, setExamLevels] = useState<MasterRecord[]>(initialExamLevels);
  const [subjects, setSubjects] = useState<MasterRecord[]>(initialSubjects);
  const [chapters, setChapters] = useState<MasterRecord[]>(initialChapters);
  const [topics, setTopics] = useState<MasterRecord[]>(initialTopics);
  const [batches, setBatches] = useState<MasterRecord[]>(initialBatches);
  const [users, setUsers] = useState<MasterRecord[]>(initialUsers);
  const [teachers, setTeachers] = useState<MasterRecord[]>(initialTeachers);
  const [focusPresets, setFocusPresets] = useState<MasterRecord[]>(initialFocusPresets);
  const [badges, setBadges] = useState<MasterRecord[]>(initialBadges);
  const [notificationTemplates, setNotificationTemplates] = useState<MasterRecord[]>(initialNotificationTemplates);
  const [rubrics, setRubrics] = useState<MasterRecord[]>(initialRubrics);
  const [leaderboards, setLeaderboards] = useState<MasterRecord[]>(initialLeaderboards);
  const [liveSessions, setLiveSessions] = useState<MasterRecord[]>(initialLiveSessions);
  const [notificationPrefs, setNotificationPrefs] = useState<MasterRecord[]>(initialNotificationPrefs);

  const [currentMaster, setCurrentMaster] = useState<string>("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MasterRecord | null>(null);
  const [formData, setFormData] = useState<MasterRecord>({ id: "" });
  const { toast } = useToast();

  const masters = [
    { name: "Exam Levels", data: examLevels, setter: setExamLevels, fields: [
      { name: "name", type: "text", required: true },
      { name: "description", type: "textarea" },
      { name: "attempt_info", type: "text" },
      { name: "active", type: "switch", default: true },
    ] },
    { name: "Subjects", data: subjects, setter: setSubjects, fields: [
      { name: "name", type: "text", required: true },
      { name: "code", type: "text" },
      { name: "exam_level_id", type: "select", options: examLevels, labelKey: "name", valueKey: "id", required: true },
      { name: "description", type: "textarea" },
      { name: "default_thumbnail", type: "file" },
      { name: "recommended_hours", type: "number" },
      { name: "tags", type: "text" },
      { name: "active", type: "switch", default: true },
    ] },
    { name: "Chapters", data: chapters, setter: setChapters, fields: [
      { name: "subject_id", type: "select", options: subjects, labelKey: "name", valueKey: "id", required: true },
      { name: "title", type: "text", required: true },
      { name: "chapter_no", type: "number", required: true },
      { name: "short_description", type: "textarea" },
      { name: "topics", type: "textarea" },
      { name: "est_time_hours", type: "number" },
      { name: "difficulty", type: "select", options: [{id:1,name:"1"},{id:2,name:"2"},{id:3,name:"3"},{id:4,name:"4"},{id:5,name:"5"}], labelKey: "name", valueKey: "id" },
      { name: "attachments", type: "file" },
      { name: "prerequisites", type: "text" },
      { name: "exam_weightage_pct", type: "number" },
      { name: "active", type: "switch", default: true },
    ] },
    { name: "Topics", data: topics, setter: setTopics, fields: [
      { name: "chapter_id", type: "select", options: chapters, labelKey: "title", valueKey: "id", required: true },
      { name: "title", type: "text", required: true },
      { name: "est_time_minutes", type: "number" },
      { name: "question_samples_count", type: "number" },
    ] },
    { name: "Batches", data: batches, setter: setBatches, fields: [
      { name: "name", type: "text", required: true },
      { name: "level_id", type: "select", options: examLevels, labelKey: "name", valueKey: "id", required: true },
      { name: "academic_year", type: "text", required: true },
      { name: "start_date", type: "date", required: true },
      { name: "end_date", type: "date", required: true },
      { name: "teacher_ids", type: "text" },
      { name: "student_count", type: "number" },
      { name: "capacity", type: "number" },
      { name: "tags", type: "text" },
      { name: "active", type: "switch", default: true },
    ] },
    { name: "Users", data: users, setter: setUsers, fields: [
      { name: "role", type: "select", options: [{id:"student",name:"Student"},{id:"teacher",name:"Teacher"},{id:"admin",name:"Admin"},{id:"superadmin",name:"SuperAdmin"}], labelKey: "name", valueKey: "id", required: true },
      { name: "name", type: "text", required: true },
      { name: "email", type: "email", required: true },
      { name: "phone", type: "text" },
      { name: "registration_source", type: "text" },
      { name: "status", type: "select", options: [{id:"pending",name:"Pending"},{id:"active",name:"Active"},{id:"suspended",name:"Suspended"}], labelKey: "name", valueKey: "id", required: true },
      { name: "created_at", type: "date" },
      { name: "last_login", type: "date" },
    ] },
    { name: "Teachers", data: teachers, setter: setTeachers, fields: [
      { name: "user_id", type: "select", options: users, labelKey: "name", valueKey: "id", required: true },
      { name: "qualifications", type: "textarea" },
      { name: "experience_years", type: "number" },
      { name: "subjects", type: "text" },
      { name: "office_hours", type: "text" },
      { name: "bio", type: "textarea" },
      { name: "social_links", type: "text" },
    ] },
    { name: "Focus Presets", data: focusPresets, setter: setFocusPresets, fields: [
      { name: "name", type: "text", required: true },
      { name: "study_duration_min", type: "number", required: true },
      { name: "break_duration_min", type: "number", required: true },
      { name: "allow_pause_on_blur", type: "switch", default: true },
      { name: "icon", type: "text" },
      { name: "description", type: "textarea" },
      { name: "active", type: "switch", default: true },
    ] },
    { name: "Badges", data: badges, setter: setBadges, fields: [
      { name: "name", type: "text", required: true },
      { name: "icon_url", type: "text" },
      { name: "description", type: "textarea" },
      { name: "criteria_expression", type: "textarea" },
      { name: "points", type: "number" },
      { name: "expiry_days", type: "number" },
      { name: "auto_award", type: "switch", default: true },
      { name: "visible_to_students", type: "switch", default: true },
    ] },
    { name: "Notification Templates", data: notificationTemplates, setter: setNotificationTemplates, fields: [
      { name: "name", type: "text", required: true },
      { name: "channel", type: "text", required: true },
      { name: "subject", type: "text" },
      { name: "body_template", type: "textarea", required: true },
      { name: "default_send_timing", type: "text" },
      { name: "active", type: "switch", default: true },
    ] },
    { name: "Rubrics", data: rubrics, setter: setRubrics, fields: [
      { name: "name", type: "text", required: true },
      { name: "criteria", type: "textarea", required: true }, // JSON string
    ] },
    { name: "Leaderboards", data: leaderboards, setter: setLeaderboards, fields: [
      { name: "rule_name", type: "text", required: true },
      { name: "metric", type: "text", required: true },
      { name: "rank_window", type: "text", required: true },
      { name: "reward_points", type: "number" },
    ] },
    { name: "Live Sessions", data: liveSessions, setter: setLiveSessions, fields: [
      { name: "title", type: "text", required: true },
      { name: "speaker_ids", type: "text" },
      { name: "date_time", type: "date" },
      { name: "duration", type: "number" },
      { name: "platform", type: "text" },
      { name: "recording_url", type: "text" },
      { name: "access_type", type: "text" },
      { name: "attachments", type: "text" },
    ] },
    { name: "Notification Preferences", data: notificationPrefs, setter: setNotificationPrefs, fields: [
      { name: "default_channels", type: "text" },
      { name: "frequency_presets", type: "text" },
      { name: "content_categories", type: "text" },
    ] },
  ];

  const openDialog = (masterName: string, record?: MasterRecord) => {
    setCurrentMaster(masterName);
    setEditingRecord(record || null);
    setFormData(record || { id: Date.now().toString() });
    setIsDialogOpen(true);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const saveRecord = () => {
    const current = masters.find(m => m.name === currentMaster);
    if (!current) return;

    if (editingRecord) {
      current.setter(current.data.map(r => r.id === formData.id ? formData : r));
    } else {
      current.setter([...current.data, formData]);
    }

    toast({ title: "Success", description: `${currentMaster} record ${editingRecord ? "updated" : "added"}` });
    setIsDialogOpen(false);
  };

  const deleteRecord = (masterName: string, id: string) => {
    const current = masters.find(m => m.name === masterName);
    if (!current) return;

    current.setter(current.data.filter(r => r.id !== id));
    toast({ title: "Success", description: `${masterName} record deleted` });
  };

  const currentFields = masters.find(m => m.name === currentMaster)?.fields || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <AdminNavigation />
      
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-heading font-bold">Manage Masters</h1>
          <p className="text-muted-foreground mt-2">Create and edit reference data</p>
        </div>

        {masters.map(master => (
          <Card key={master.name} className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-heading font-bold">{master.name}</h2>
              <Button variant="gradient" onClick={() => openDialog(master.name)}>
                <Plus className="w-4 h-4 mr-2" />
                Add New
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  {master.fields.map(field => (
                    <TableHead key={field.name}>{field.name}</TableHead>
                  ))}
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {master.data.map(record => (
                  <TableRow key={record.id}>
                    {master.fields.map(field => (
                      <TableCell key={field.name}>
                        {field.type === "switch" ? (record[field.name] ? "Active" : "Inactive") : record[field.name]}
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button variant="ghost" onClick={() => openDialog(master.name, record)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" onClick={() => deleteRecord(master.name, record.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        ))}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingRecord ? "Edit" : "Add"} {currentMaster}</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              {currentFields.map(field => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>{field.name} {field.required ? "*" : ""}</Label>
                  {field.type === "text" || field.type === "email" || field.type === "number" ? (
                    <Input
                      id={field.name}
                      type={field.type}
                      value={formData[field.name] || ""}
                      onChange={e => handleInputChange(field.name, e.target.value)}
                    />
                  ) : field.type === "textarea" ? (
                    <Textarea
                      id={field.name}
                      value={formData[field.name] || ""}
                      onChange={e => handleInputChange(field.name, e.target.value)}
                    />
                  ) : field.type === "switch" ? (
                    <Switch
                      checked={formData[field.name] ?? field.default}
                      onCheckedChange={checked => handleInputChange(field.name, checked)}
                    />
                  ) : field.type === "select" ? (
                    <Select value={formData[field.name]?.toString() || ""} onValueChange={v => handleInputChange(field.name, v)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map(option => (
                          <SelectItem key={option[field.valueKey || "id"]} value={option[field.valueKey || "id"]}>
                            {option[field.labelKey || "name"]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === "file" ? (
                    <Input id={field.name} type="file" onChange={e => handleInputChange(field.name, e.target.files?.[0]?.name || "")} />
                  ) : field.type === "date" ? (
                    <Input id={field.name} type="date" value={formData[field.name] || ""} onChange={e => handleInputChange(field.name, e.target.value)} />
                  ) : null}
                </div>
              ))}
            </div>
            <Button variant="gradient" onClick={saveRecord}>
              Save
            </Button>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminMasters;
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, X, Upload, Video, FileText, Users, Clock, Plus, Trash2, Image, BookOpen, CheckCircle, Eye, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  video_url?: string;
  content?: string;
  is_free: boolean;
  resources: Resource[];
  quiz_questions?: QuizQuestion[];
}

interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'link' | 'file';
  url: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correct_answer: string;
  explanation?: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  order_index: number;
  lessons: Lesson[];
}

interface CourseData {
  title: string;
  description: string;
  long_description: string;
  thumbnail_url: string;
  trailer_url: string;
  instructor_id: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  subscription_tier: 'free' | 'basic' | 'premium';
  duration_hours: number;
  language: string;
  published: boolean;
  featured: boolean;
  prerequisites: string[];
  objectives: string[];
  target_audience: string[];
  modules: Module[];
  tags: string[];
  what_you_learn: string[];
  requirements: string[];
  course_features: string[];
}

const CATEGORIES = [
  "Desarrollo Web", "Programación", "Data Science", "Machine Learning", 
  "Diseño", "Marketing Digital", "Negocios", "Fotografía", "Música", 
  "Idiomas", "Salud y Fitness", "Desarrollo Personal"
];

const LANGUAGES = [
  "Español", "Inglés", "Portugués", "Francés", "Alemán", "Italiano"
];

const COURSE_FEATURES = [
  "Videos en HD", "Acceso de por vida", "Certificado de finalización", 
  "Recursos descargables", "Soporte del instructor", "Acceso móvil",
  "Subtítulos", "Ejercicios prácticos", "Proyectos finales", "Comunidad de estudiantes"
];

const AdminCourseEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile } = useAuth();
  const isEdit = id !== "new";

  const [currentStep, setCurrentStep] = useState(0);
  const [previewMode, setPreviewMode] = useState(false);

  const [courseData, setCourseData] = useState<CourseData>({
    title: "",
    description: "",
    long_description: "",
    thumbnail_url: "",
    trailer_url: "",
    instructor_id: user?.id || "",
    category: "",
    level: "beginner",
    subscription_tier: "basic",
    duration_hours: 0,
    language: "Español",
    published: false,
    featured: false,
    prerequisites: [],
    objectives: [],
    target_audience: [],
    modules: [],
    tags: [],
    what_you_learn: [],
    requirements: [],
    course_features: []
  });

  const [newItem, setNewItem] = useState({
    prerequisite: "",
    objective: "",
    audience: "",
    tag: "",
    learning: "",
    requirement: ""
  });

  const steps = [
    { id: 0, title: "Información Básica", icon: BookOpen },
    { id: 1, title: "Contenido del Curso", icon: Video },
    { id: 2, title: "Configuración", icon: Settings },
    { id: 3, title: "Previsualización", icon: Eye }
  ];

  useEffect(() => {
    if (isEdit) {
      loadCourseData();
    }
  }, [id]);

  const loadCourseData = async () => {
    if (isEdit) {
      setCourseData({
        title: "Desarrollo Web Full Stack Avanzado",
        description: "Aprende a crear aplicaciones web completas con React, Node.js y bases de datos",
        long_description: "Este curso completo te llevará desde los fundamentos hasta nivel avanzado en desarrollo web full stack.",
        thumbnail_url: "/placeholder.svg",
        trailer_url: "",
        instructor_id: user?.id || "",
        category: "Desarrollo Web",
        level: "intermediate",
        subscription_tier: "premium",
        duration_hours: 45,
        language: "Español",
        published: false,
        featured: false,
        prerequisites: ["Conocimientos básicos de HTML y CSS", "Fundamentos de JavaScript"],
        objectives: ["Crear aplicaciones web completas", "Dominar React y Node.js", "Implementar bases de datos"],
        target_audience: ["Desarrolladores junior", "Estudiantes de programación"],
        modules: [
          {
            id: "1",
            title: "Fundamentos de React",
            description: "Aprende los conceptos básicos de React",
            order_index: 1,
            lessons: [
              {
                id: "1",
                title: "Introducción a React",
                description: "Conceptos básicos y configuración del entorno",
                duration_minutes: 30,
                type: "video",
                is_free: true,
                resources: []
              }
            ]
          }
        ],
        tags: ["React", "Node.js", "Full Stack", "JavaScript"],
        what_you_learn: ["Crear componentes React", "Desarrollar APIs REST"],
        requirements: ["Computadora con internet", "Ganas de aprender"],
        course_features: ["Videos en HD", "Acceso de por vida", "Certificado de finalización"]
      });
    }
  };

  const handleSave = async () => {
    if (!courseData.title || !courseData.description || !courseData.category) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    try {
      toast({
        title: isEdit ? "Curso actualizado" : "Curso creado",
        description: `El curso "${courseData.title}" ha sido ${isEdit ? "actualizado" : "creado"} exitosamente.`
      });
      navigate("/admin");
    } catch (error) {
      console.error("Error saving course:", error);
      toast({
        title: "Error",
        description: "Error al guardar el curso",
        variant: "destructive"
      });
    }
  };

  const addModule = () => {
    const newModule: Module = {
      id: Date.now().toString(),
      title: "Nuevo Módulo",
      description: "",
      order_index: courseData.modules.length + 1,
      lessons: []
    };
    setCourseData({
      ...courseData,
      modules: [...courseData.modules, newModule]
    });
  };

  const addLesson = (moduleId: string) => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: "Nueva Lección",
      description: "",
      duration_minutes: 0,
      type: "video",
      is_free: false,
      resources: []
    };

    setCourseData({
      ...courseData,
      modules: courseData.modules.map(module =>
        module.id === moduleId
          ? { ...module, lessons: [...module.lessons, newLesson] }
          : module
      )
    });
  };

  const addArrayItem = (field: keyof typeof newItem, arrayField: keyof CourseData) => {
    const value = newItem[field].trim();
    if (value) {
      setCourseData({
        ...courseData,
        [arrayField]: [...(courseData[arrayField] as string[]), value]
      });
      setNewItem({ ...newItem, [field]: "" });
    }
  };

  const removeArrayItem = (arrayField: keyof CourseData, index: number) => {
    setCourseData({
      ...courseData,
      [arrayField]: (courseData[arrayField] as string[]).filter((_, i) => i !== index)
    });
  };

  const calculateProgress = () => {
    const requiredFields = ['title', 'description', 'category', 'level'];
    const completedFields = requiredFields.filter(field => courseData[field as keyof CourseData]);
    return (completedFields.length / requiredFields.length) * 100;
  };

  const updateModuleTitle = (moduleIndex: number, title: string) => {
    const updatedModules = courseData.modules.map((m, i) =>
      i === moduleIndex ? { ...m, title } : m
    );
    setCourseData({ ...courseData, modules: updatedModules });
  };

  const updateLessonProperty = (moduleIndex: number, lessonIndex: number, property: string, value: any) => {
    const updatedModules = courseData.modules.map((m, i) =>
      i === moduleIndex
        ? {
            ...m,
            lessons: m.lessons.map((l, j) =>
              j === lessonIndex ? { ...l, [property]: value } : l
            )
          }
        : m
    );
    setCourseData({ ...courseData, modules: updatedModules });
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    const updatedModules = courseData.modules.map((m, i) =>
      i === moduleIndex
        ? { ...m, lessons: m.lessons.filter((_, j) => j !== lessonIndex) }
        : m
    );
    setCourseData({ ...courseData, modules: updatedModules });
  };

  const removeModule = (moduleIndex: number) => {
    const updatedModules = courseData.modules.filter((_, i) => i !== moduleIndex);
    setCourseData({ ...courseData, modules: updatedModules });
  };

  const addFeatureToList = (feature: string) => {
    setCourseData({
      ...courseData,
      course_features: [...courseData.course_features, feature]
    });
  };

  const removeFeatureFromList = (feature: string) => {
    setCourseData({
      ...courseData,
      course_features: courseData.course_features.filter(f => f !== feature)
    });
  };

  if (!user || profile?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">Acceso Denegado</h3>
            <p className="text-gray-600">Solo los administradores pueden acceder a esta página.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => navigate("/admin")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Panel
              </Button>
              <div>
                <h1 className="text-2xl font-bold">
                  {isEdit ? "Editar Curso" : "Crear Nuevo Curso"}
                </h1>
                <p className="text-gray-600">
                  {courseData.title || "Curso sin título"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Progreso: {Math.round(calculateProgress())}%
              </div>
              <Progress value={calculateProgress()} className="w-32" />
              <Button variant="outline" onClick={() => setPreviewMode(!previewMode)}>
                <Eye className="h-4 w-4 mr-2" />
                {previewMode ? "Editar" : "Previsualizar"}
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                {isEdit ? "Actualizar" : "Crear"} Curso
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {previewMode ? (
          <CoursePreview courseData={courseData} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Steps */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Pasos de Creación</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {steps.map((step) => {
                      const Icon = step.icon;
                      return (
                        <button
                          key={step.id}
                          onClick={() => setCurrentStep(step.id)}
                          className={`w-full text-left p-3 rounded-lg flex items-center space-x-3 transition-colors ${
                            currentStep === step.id
                              ? "bg-blue-100 text-blue-700 border border-blue-200"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="font-medium">{step.title}</span>
                          {currentStep > step.id && (
                            <CheckCircle className="h-4 w-4 text-green-600 ml-auto" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {currentStep === 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Información Básica del Curso</CardTitle>
                    <CardDescription>
                      Completa la información fundamental de tu curso
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Título del Curso *</Label>
                        <Input
                          id="title"
                          value={courseData.title}
                          onChange={(e) => setCourseData({...courseData, title: e.target.value})}
                          placeholder="Ej: Desarrollo Web Full Stack con React"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category">Categoría *</Label>
                        <Select 
                          value={courseData.category} 
                          onValueChange={(value) => setCourseData({...courseData, category: value})}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona una categoría" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Descripción Corta *</Label>
                      <Textarea
                        id="description"
                        value={courseData.description}
                        onChange={(e) => setCourseData({...courseData, description: e.target.value})}
                        placeholder="Descripción breve que aparecerá en las tarjetas del curso"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="long_description">Descripción Detallada</Label>
                      <Textarea
                        id="long_description"
                        value={courseData.long_description}
                        onChange={(e) => setCourseData({...courseData, long_description: e.target.value})}
                        placeholder="Descripción completa del curso, objetivos, metodología..."
                        rows={6}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="level">Nivel</Label>
                        <Select 
                          value={courseData.level} 
                          onValueChange={(value: 'beginner' | 'intermediate' | 'advanced') => 
                            setCourseData({...courseData, level: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Principiante</SelectItem>
                            <SelectItem value="intermediate">Intermedio</SelectItem>
                            <SelectItem value="advanced">Avanzado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subscription_tier">Plan de Suscripción</Label>
                        <Select 
                          value={courseData.subscription_tier} 
                          onValueChange={(value: 'free' | 'basic' | 'premium') => 
                            setCourseData({...courseData, subscription_tier: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="free">Gratuito</SelectItem>
                            <SelectItem value="basic">Básico ($29/mes)</SelectItem>
                            <SelectItem value="premium">Premium ($49/mes)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="language">Idioma</Label>
                        <Select 
                          value={courseData.language} 
                          onValueChange={(value) => setCourseData({...courseData, language: value})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {LANGUAGES.map((lang) => (
                              <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Imagen de Portada</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        {courseData.thumbnail_url ? (
                          <div className="space-y-4">
                            <img 
                              src={courseData.thumbnail_url} 
                              alt="Preview" 
                              className="mx-auto h-32 w-48 object-cover rounded"
                            />
                            <Button variant="outline" onClick={() => setCourseData({...courseData, thumbnail_url: ""})}>
                              Cambiar Imagen
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <Image className="mx-auto h-12 w-12 text-gray-400" />
                            <div>
                              <Button 
                                variant="outline" 
                                onClick={() => setCourseData({...courseData, thumbnail_url: "/placeholder.svg"})}
                              >
                                <Upload className="h-4 w-4 mr-2" />
                                Subir Imagen
                              </Button>
                              <p className="text-sm text-gray-500 mt-2">
                                JPG, PNG o GIF (máximo 2MB)
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {currentStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Contenido del Curso</CardTitle>
                    <CardDescription>
                      Organiza tu curso en módulos y lecciones
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {courseData.modules.map((module, moduleIndex) => (
                        <Card key={module.id} className="border-l-4 border-l-blue-500">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-lg">Módulo {moduleIndex + 1}</CardTitle>
                                <Input
                                  value={module.title}
                                  onChange={(e) => updateModuleTitle(moduleIndex, e.target.value)}
                                  className="mt-2 font-medium"
                                  placeholder="Título del módulo"
                                />
                              </div>
                              <div className="flex space-x-2">
                                <Button
                                  variant="outline"
                                  onClick={() => addLesson(module.id)}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Lección
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => removeModule(moduleIndex)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {module.lessons.map((lesson, lessonIndex) => (
                                <div key={lesson.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                                  <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <Input
                                      value={lesson.title}
                                      onChange={(e) => updateLessonProperty(moduleIndex, lessonIndex, 'title', e.target.value)}
                                      placeholder="Título de la lección"
                                    />
                                    <Select
                                      value={lesson.type}
                                      onValueChange={(value: 'video' | 'text' | 'quiz' | 'assignment') => 
                                        updateLessonProperty(moduleIndex, lessonIndex, 'type', value)}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="video">Video</SelectItem>
                                        <SelectItem value="text">Texto</SelectItem>
                                        <SelectItem value="quiz">Quiz</SelectItem>
                                        <SelectItem value="assignment">Tarea</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <Input
                                      type="number"
                                      value={lesson.duration_minutes}
                                      onChange={(e) => updateLessonProperty(moduleIndex, lessonIndex, 'duration_minutes', parseInt(e.target.value) || 0)}
                                      placeholder="Duración (min)"
                                    />
                                    <div className="flex items-center space-x-2">
                                      <Switch
                                        checked={lesson.is_free}
                                        onCheckedChange={(checked) => updateLessonProperty(moduleIndex, lessonIndex, 'is_free', checked)}
                                      />
                                      <Label className="text-sm">Gratis</Label>
                                    </div>
                                  </div>
                                  <Button
                                    variant="destructive"
                                    onClick={() => removeLesson(moduleIndex, lessonIndex)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      ))}

                      <Button onClick={addModule} className="w-full" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Agregar Módulo
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {currentStep === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración del Curso</CardTitle>
                    <CardDescription>
                      Configuraciones adicionales y metadatos
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Publicar Curso</Label>
                          <p className="text-sm text-gray-500">Hacer visible para estudiantes</p>
                        </div>
                        <Switch
                          checked={courseData.published}
                          onCheckedChange={(checked) => setCourseData({...courseData, published: checked})}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Curso Destacado</Label>
                          <p className="text-sm text-gray-500">Mostrar en página principal</p>
                        </div>
                        <Switch
                          checked={courseData.featured}
                          onCheckedChange={(checked) => setCourseData({...courseData, featured: checked})}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Características del Curso</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {COURSE_FEATURES.map((feature) => (
                          <div key={feature} className="flex items-center space-x-2">
                            <Switch
                              checked={courseData.course_features.includes(feature)}
                              onCheckedChange={() => {
                                const isSelected = courseData.course_features.includes(feature);
                                if (isSelected) {
                                  removeFeatureFromList(feature);
                                } else {
                                  addFeatureToList(feature);
                                }
                              }}
                            />
                            <Label className="text-sm">{feature}</Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label>Tags del Curso</Label>
                      <div className="flex space-x-2">
                        <Input
                          value={newItem.tag}
                          onChange={(e) => setNewItem({...newItem, tag: e.target.value})}
                          placeholder="Agregar tag"
                          onKeyDown={(e) => e.key === 'Enter' && addArrayItem('tag', 'tags')}
                        />
                        <Button onClick={() => addArrayItem('tag', 'tags')}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {courseData.tags.map((tag, index) => (
                          <Badge key={`tag-${tag}-${index}`} variant="secondary" className="flex items-center space-x-1">
                            <span>{tag}</span>
                            <X 
                              className="h-3 w-3 cursor-pointer" 
                              onClick={() => removeArrayItem('tags', index)}
                            />
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {currentStep === 3 && (
                <CoursePreview courseData={courseData} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CoursePreview = ({ courseData }: { courseData: CourseData }) => {
  const getBadgeClasses = (tier: string) => {
    const baseClasses = "inline-block";
    switch (tier) {
      case 'free':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case 'basic':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'premium':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Previsualización del Curso</CardTitle>
        <CardDescription>
          Así se verá tu curso para los estudiantes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <img
                src={courseData.thumbnail_url || "/placeholder.svg"}
                alt={courseData.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="space-y-4">
              <Badge className={getBadgeClasses(courseData.subscription_tier)}>
                {courseData.subscription_tier.toUpperCase()}
              </Badge>
              <h1 className="text-2xl font-bold">{courseData.title}</h1>
              <p className="text-gray-600">{courseData.description}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{courseData.duration_hours}h</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{courseData.level}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contenido del Curso</h3>
            {courseData.modules.map((module, index) => (
              <Card key={module.id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    Módulo {index + 1}: {module.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {module.lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                        <div className="flex items-center space-x-3">
                          {lesson.type === 'video' && <Video className="h-4 w-4" />}
                          {lesson.type === 'text' && <FileText className="h-4 w-4" />}
                          <span>{lesson.title}</span>
                          {lesson.is_free && <Badge variant="outline">Gratis</Badge>}
                        </div>
                        <span className="text-sm text-gray-500">{lesson.duration_minutes}min</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminCourseEditor;
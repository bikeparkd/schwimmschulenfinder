
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, ArrowLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const RegisterSchwimmschule = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    postal_code: "",
    description: "",
    contact_person_name: "",
    contact_person_role: "",
    features: [] as string[],
    opening_hours: {
      monday: "",
      tuesday: "",
      wednesday: "",
      thursday: "",
      friday: "",
      saturday: "",
      sunday: ""
    }
  });

  const availableFeatures = [
    "Babyschwimmen",
    "Kinderschwimmen",
    "Erwachsenenschwimmen",
    "Aqua Fitness",
    "Schwimmkurse für Anfänger",
    "Fortgeschrittenen Kurse",
    "Privatstunden",
    "Gruppenunterricht",
    "Wettkampftraining",
    "Therapieschwimmen"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleOpeningHoursChange = (day: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      opening_hours: { ...prev.opening_hours, [day]: value }
    }));
  };

  const handleFeatureChange = (feature: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      features: checked 
        ? [...prev.features, feature]
        : prev.features.filter(f => f !== feature)
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;
    
    const fileExt = imageFile.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('schwimmschule-photos')
      .upload(fileName, imageFile);
    
    if (error) {
      console.error('Upload error:', error);
      return null;
    }
    
    const { data: { publicUrl } } = supabase.storage
      .from('schwimmschule-photos')
      .getPublicUrl(fileName);
    
    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload image first
      const imageUrl = await uploadImage();
      
      // Insert registration
      const { error } = await supabase
        .from('schwimmschule_registrations')
        .insert({
          ...formData,
          image_url: imageUrl,
          status: 'pending'
        });

      if (error) throw error;

      toast.success("Registrierung erfolgreich eingereicht! Sie erhalten eine Bestätigungsemail.");
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("Fehler beim Einreichen der Registrierung. Bitte versuchen Sie es erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-4">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Zurück zur Übersicht
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Schwimmschule Registrierung
            </CardTitle>
            <p className="text-gray-600 text-center">
              Tragen Sie Ihre Schwimmschule in unser Verzeichnis ein
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Kontaktinformationen */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Kontaktinformationen</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name der Schwimmschule *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">E-Mail Adresse *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Telefonnummer</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact_person_name">Ansprechpartner Name</Label>
                    <Input
                      id="contact_person_name"
                      value={formData.contact_person_name}
                      onChange={(e) => handleInputChange('contact_person_name', e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="contact_person_role">Position/Rolle</Label>
                    <Input
                      id="contact_person_role"
                      value={formData.contact_person_role}
                      onChange={(e) => handleInputChange('contact_person_role', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Adresse */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Adresse</h3>
                
                <div>
                  <Label htmlFor="address">Straße und Hausnummer *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="postal_code">Postleitzahl *</Label>
                    <Input
                      id="postal_code"
                      value={formData.postal_code}
                      onChange={(e) => handleInputChange('postal_code', e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="city">Stadt *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Beschreibung */}
              <div>
                <Label htmlFor="description">Beschreibung Ihrer Schwimmschule</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  placeholder="Beschreiben Sie Ihre Schwimmschule und was Sie besonders macht..."
                />
              </div>

              {/* Features */}
              <div>
                <Label>Angebotene Kurse und Services</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {availableFeatures.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={feature}
                        checked={formData.features.includes(feature)}
                        onCheckedChange={(checked) => 
                          handleFeatureChange(feature, checked as boolean)
                        }
                      />
                      <Label htmlFor={feature} className="text-sm">
                        {feature}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Öffnungszeiten */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Öffnungszeiten</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(formData.opening_hours).map(([day, time]) => (
                    <div key={day}>
                      <Label htmlFor={day}>
                        {day === 'monday' ? 'Montag' :
                         day === 'tuesday' ? 'Dienstag' :
                         day === 'wednesday' ? 'Mittwoch' :
                         day === 'thursday' ? 'Donnerstag' :
                         day === 'friday' ? 'Freitag' :
                         day === 'saturday' ? 'Samstag' : 'Sonntag'}
                      </Label>
                      <Input
                        id={day}
                        value={time}
                        onChange={(e) => handleOpeningHoursChange(day, e.target.value)}
                        placeholder="z.B. 09:00-18:00 oder Geschlossen"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Foto Upload */}
              <div>
                <Label htmlFor="image">Foto Ihrer Schwimmschule</Label>
                <div className="mt-2">
                  <input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Label
                    htmlFor="image"
                    className="cursor-pointer flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                  >
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600">
                          Klicken Sie hier, um ein Foto hochzuladen
                        </p>
                      </div>
                    )}
                  </Label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? "Wird eingereicht..." : "Registrierung einreichen"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterSchwimmschule;

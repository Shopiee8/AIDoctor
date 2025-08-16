'use client';

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Stethoscope, Upload, X, Loader2, User, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

interface FormData {
    gender: string;
    address: string;
    address2: string;
    zipcode: string;
    age: string;
    bloodGroup: string;
    rightToSellCert: File | null;
    photoId: File | null;
}

interface DocumentUpload {
    file: File | null;
    preview: string;
    isUploading: boolean;
}

export default function RegisterStepTwo() {
    const { toast } = useToast();
    const router = useRouter();
    
    // Form state
    const [formData, setFormData] = useState<FormData>({
        gender: 'male',
        address: '',
        address2: '',
        zipcode: '',
        age: '',
        bloodGroup: '',
        rightToSellCert: null,
        photoId: null,
    });

    // Document upload states
    const [rightToSellDoc, setRightToSellDoc] = useState<DocumentUpload>({
        file: null,
        preview: '',
        isUploading: false
    });
    
    const [photoIdDoc, setPhotoIdDoc] = useState<DocumentUpload>({
        file: null,
        preview: '',
        isUploading: false
    });

    // File input refs
    const rightToSellRef = useRef<HTMLInputElement>(null);
    const photoIdRef = useRef<HTMLInputElement>(null);

    // Load saved data from localStorage on component mount
    useEffect(() => {
        const savedData = localStorage.getItem('doctorRegistration_step2');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setFormData(prev => ({ ...prev, ...parsed }));
            } catch (error) {
                console.error('Error loading saved data:', error);
            }
        }
    }, []);

    // Save form data to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('doctorRegistration_step2', JSON.stringify(formData));
    }, [formData]);

    const validateFile = (file: File, type: 'image' | 'document'): string | null => {
        // Check file size (5MB limit for documents, 2MB for images)
        const maxSize = type === 'document' ? 5 * 1024 * 1024 : 2 * 1024 * 1024;
        if (file.size > maxSize) {
            return `File size must be less than ${type === 'document' ? '5MB' : '2MB'}`;
        }
        
        // Check file type
        const allowedTypes = type === 'document' 
            ? ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']
            : ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            
        if (!allowedTypes.includes(file.type)) {
            return type === 'document' 
                ? 'Only JPG, PNG, GIF, and PDF files are allowed'
                : 'Only JPG, PNG, and GIF files are allowed';
        }
        
        return null;
    };

    const handleDocumentUpload = async (
        event: React.ChangeEvent<HTMLInputElement>, 
        docType: 'rightToSell' | 'photoId'
    ) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const validationError = validateFile(file, 'document');
        if (validationError) {
            toast({
                title: 'Invalid File',
                description: validationError,
                variant: 'destructive'
            });
            return;
        }

        const setDocState = docType === 'rightToSell' ? setRightToSellDoc : setPhotoIdDoc;
        
        setDocState(prev => ({ ...prev, isUploading: true }));

        try {
            let previewUrl = '';
            
            // Create preview for images
            if (file.type.startsWith('image/')) {
                previewUrl = URL.createObjectURL(file);
            }

            setDocState({
                file,
                preview: previewUrl,
                isUploading: false
            });

            // Update form data
            setFormData(prev => ({
                ...prev,
                [docType === 'rightToSell' ? 'rightToSellCert' : 'photoId']: file
            }));

            // Store file info in localStorage (without the actual file data)
            const fileInfo = {
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified
            };
            localStorage.setItem(`doctorRegistration_${docType}`, JSON.stringify(fileInfo));

            toast({
                title: 'Document Uploaded',
                description: `${docType === 'rightToSell' ? 'Right to Sell Certificate' : 'Photo ID'} has been uploaded successfully.`
            });

        } catch (error) {
            console.error('Error uploading document:', error);
            setDocState(prev => ({ ...prev, isUploading: false }));
            toast({
                title: 'Upload Error',
                description: 'Failed to upload document. Please try again.',
                variant: 'destructive'
            });
        }
    };

    const removeDocument = (docType: 'rightToSell' | 'photoId') => {
        const docState = docType === 'rightToSell' ? rightToSellDoc : photoIdDoc;
        const setDocState = docType === 'rightToSell' ? setRightToSellDoc : setPhotoIdDoc;
        const inputRef = docType === 'rightToSell' ? rightToSellRef : photoIdRef;

        // Cleanup preview URL
        if (docState.preview) {
            URL.revokeObjectURL(docState.preview);
        }

        // Reset state
        setDocState({
            file: null,
            preview: '',
            isUploading: false
        });

        // Update form data
        setFormData(prev => ({
            ...prev,
            [docType === 'rightToSell' ? 'rightToSellCert' : 'photoId']: null
        }));

        // Clear localStorage
        localStorage.removeItem(`doctorRegistration_${docType}`);

        // Clear file input
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validateForm = (): boolean => {
        const requiredFields = ['address', 'zipcode', 'age'];
        const missingFields = requiredFields.filter(field => !formData[field as keyof FormData]);

        if (missingFields.length > 0) {
            toast({
                title: 'Missing Information',
                description: 'Please fill in all required fields.',
                variant: 'destructive'
            });
            return false;
        }

        if (!formData.rightToSellCert || !formData.photoId) {
            toast({
                title: 'Missing Documents',
                description: 'Please upload both required documents.',
                variant: 'destructive'
            });
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        try {
            // Here you would typically upload the files to your storage service
            // For now, we'll just store the form data and navigate to the next step
            
            toast({
                title: 'Success',
                description: 'Personal details saved successfully.'
            });

            router.push('/doctor-register/step-3');
        } catch (error) {
            console.error('Error saving form:', error);
            toast({
                title: 'Error',
                description: 'Failed to save personal details. Please try again.',
                variant: 'destructive'
            });
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (rightToSellDoc.preview) URL.revokeObjectURL(rightToSellDoc.preview);
            if (photoIdDoc.preview) URL.revokeObjectURL(photoIdDoc.preview);
        };
    }, [rightToSellDoc.preview, photoIdDoc.preview]);

    return (
        <Card className="w-full">
            <CardHeader className="text-center">
                <Link href="/" className="inline-block mb-4">
                    <Stethoscope className="h-8 w-8 text-primary mx-auto" />
                </Link>

                <div className="flex justify-center gap-2 my-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold">1</div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold">2</div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-500 font-bold">3</div>
                </div>

                <CardTitle className="text-2xl font-headline">Personal Details</CardTitle>
                <CardDescription>
                    Complete your personal information and upload required documents
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Gender Selection with Avatars */}
                        <div>
                            <Label className="text-base font-medium block mb-2">Select Your Gender <span className="text-red-500">*</span></Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <RadioGroup 
                                        value={formData.gender}
                                        onValueChange={(value) => handleInputChange('gender', value)}
                                        className="space-y-2"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="male" id="male" />
                                            <Label htmlFor="male" className="flex items-center space-x-2 cursor-pointer">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                    <User className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <span>Male</span>
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <div>
                                    <RadioGroup 
                                        value={formData.gender}
                                        onValueChange={(value) => handleInputChange('gender', value)}
                                        className="space-y-2"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="female" id="female" />
                                            <Label htmlFor="female" className="flex items-center space-x-2 cursor-pointer">
                                                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center">
                                                    <UserCheck className="w-4 h-4 text-pink-600" />
                                                </div>
                                                <span>Female</span>
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            </div>
                        </div>
                        
                        {/* Address Fields */}
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="address">Registered Clinic Address <span className="text-red-500">*</span></Label>
                                <Input 
                                    id="address" 
                                    placeholder="123 Health St." 
                                    value={formData.address}
                                    onChange={(e) => handleInputChange('address', e.target.value)}
                                    required 
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="address2">Address 2 (Optional)</Label>
                                <Input 
                                    id="address2" 
                                    placeholder="Suite 100" 
                                    value={formData.address2}
                                    onChange={(e) => handleInputChange('address2', e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="zipcode">Pincode / Zipcode <span className="text-red-500">*</span></Label>
                                <Input 
                                    id="zipcode" 
                                    placeholder="12345" 
                                    value={formData.zipcode}
                                    onChange={(e) => handleInputChange('zipcode', e.target.value)}
                                    required 
                                />
                            </div>
                        </div>

                        {/* Document Uploads */}
                        <div>
                            <Label className="text-base font-medium">Certifications and Documents <span className="text-red-500">*</span></Label>
                            <div className="grid md:grid-cols-2 gap-4 mt-2">
                                {/* Right to Sell Certificate */}
                                <div className="space-y-2">
                                    <div 
                                        className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all hover:border-primary hover:bg-muted/50 ${
                                            rightToSellDoc.file ? 'border-primary bg-primary/5' : 'border-muted-foreground'
                                        } ${rightToSellDoc.isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={() => !rightToSellDoc.isUploading && rightToSellRef.current?.click()}
                                    >
                                        {rightToSellDoc.file ? (
                                            <div className="space-y-2">
                                                {rightToSellDoc.preview ? (
                                                    <img 
                                                        src={rightToSellDoc.preview} 
                                                        alt="Right to Sell Certificate" 
                                                        className="w-16 h-16 object-cover mx-auto rounded"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 bg-primary/10 rounded flex items-center justify-center mx-auto">
                                                        <Upload className="w-6 h-6 text-primary" />
                                                    </div>
                                                )}
                                                <p className="text-xs text-green-600 font-medium">
                                                    ✓ {rightToSellDoc.file.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    ({(rightToSellDoc.file.size / 1024 / 1024).toFixed(2)} MB)
                                                </p>
                                            </div>
                                        ) : (
                                            <>
                                                {rightToSellDoc.isUploading ? (
                                                    <Loader2 className="w-8 h-8 text-muted-foreground mx-auto mb-2 animate-spin" />
                                                ) : (
                                                    <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                                )}
                                                <p className="text-xs text-muted-foreground">
                                                    {rightToSellDoc.isUploading ? 'Uploading...' : 'Upload Right to Sell Certificate'}
                                                </p>
                                            </>
                                        )}
                                        
                                        {rightToSellDoc.file && !rightToSellDoc.isUploading && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeDocument('rightToSell');
                                                }}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <input 
                                        type="file" 
                                        ref={rightToSellRef}
                                        onChange={(e) => handleDocumentUpload(e, 'rightToSell')}
                                        accept="image/*,.pdf"
                                        className="hidden"
                                        disabled={rightToSellDoc.isUploading}
                                    />
                                </div>

                                {/* Photo ID */}
                                <div className="space-y-2">
                                    <div 
                                        className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all hover:border-primary hover:bg-muted/50 ${
                                            photoIdDoc.file ? 'border-primary bg-primary/5' : 'border-muted-foreground'
                                        } ${photoIdDoc.isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={() => !photoIdDoc.isUploading && photoIdRef.current?.click()}
                                    >
                                        {photoIdDoc.file ? (
                                            <div className="space-y-2">
                                                {photoIdDoc.preview ? (
                                                    <img 
                                                        src={photoIdDoc.preview} 
                                                        alt="Photo ID" 
                                                        className="w-16 h-16 object-cover mx-auto rounded"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 bg-primary/10 rounded flex items-center justify-center mx-auto">
                                                        <Upload className="w-6 h-6 text-primary" />
                                                    </div>
                                                )}
                                                <p className="text-xs text-green-600 font-medium">
                                                    ✓ {photoIdDoc.file.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    ({(photoIdDoc.file.size / 1024 / 1024).toFixed(2)} MB)
                                                </p>
                                            </div>
                                        ) : (
                                            <>
                                                {photoIdDoc.isUploading ? (
                                                    <Loader2 className="w-8 h-8 text-muted-foreground mx-auto mb-2 animate-spin" />
                                                ) : (
                                                    <Camera className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                                                )}
                                                <p className="text-xs text-muted-foreground">
                                                    {photoIdDoc.isUploading ? 'Uploading...' : 'Upload Photo ID'}
                                                </p>
                                            </>
                                        )}
                                        
                                        {photoIdDoc.file && !photoIdDoc.isUploading && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeDocument('photoId');
                                                }}
                                                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <input 
                                        type="file" 
                                        ref={photoIdRef}
                                        onChange={(e) => handleDocumentUpload(e, 'photoId')}
                                        accept="image/*,.pdf"
                                        className="hidden"
                                        disabled={photoIdDoc.isUploading}
                                    />
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                Allowed: JPG, PNG, GIF, PDF • Max size: 5MB each
                            </p>
                        </div>
                        
                        {/* Age and Blood Group */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="age">Your Age <span className="text-red-500">*</span></Label>
                                <Input 
                                    id="age" 
                                    type="number" 
                                    placeholder="35" 
                                    min="18"
                                    max="100"
                                    value={formData.age}
                                    onChange={(e) => handleInputChange('age', e.target.value)}
                                    required 
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="blood_group">Blood Type (Optional)</Label>
                                <Select 
                                    value={formData.bloodGroup} 
                                    onValueChange={(value) => handleInputChange('bloodGroup', value)}
                                >
                                    <SelectTrigger id="blood_group">
                                        <SelectValue placeholder="Select blood type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="A+">A+</SelectItem>
                                        <SelectItem value="A-">A-</SelectItem>
                                        <SelectItem value="B+">B+</SelectItem>
                                        <SelectItem value="B-">B-</SelectItem>
                                        <SelectItem value="AB+">AB+</SelectItem>
                                        <SelectItem value="AB-">AB-</SelectItem>
                                        <SelectItem value="O+">O+</SelectItem>
                                        <SelectItem value="O-">O-</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 space-y-4">
                        <Button 
                            type="submit" 
                            className="w-full"
                            disabled={rightToSellDoc.isUploading || photoIdDoc.isUploading}
                        >
                            {rightToSellDoc.isUploading || photoIdDoc.isUploading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                'Continue'
                            )}
                        </Button>
                        
                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => router.push('/doctor-register/step-1')}
                                className="text-sm text-muted-foreground hover:text-primary underline"
                            >
                                ← Back to previous step
                            </button>
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
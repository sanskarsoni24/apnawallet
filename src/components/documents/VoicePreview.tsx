
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";
import { speakNotification } from "@/services/NotificationService";

interface VoicePreviewProps {
  text: string;
  onClose: () => void;
}

const VoicePreview: React.FC<VoicePreviewProps> = ({ text, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(80);
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [previewText, setPreviewText] = useState(text);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  
  // Initialize speech synthesis and get available voices
  useEffect(() => {
    const loadVoices = () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          setAvailableVoices(voices);
          // Try to find an English voice
          const englishVoice = voices.find(voice => 
            voice.lang.includes('en') && !voice.name.includes('Google')
          );
          setSelectedVoice(englishVoice || voices[0]);
        }
      }
    };

    if (typeof window !== "undefined" && window.speechSynthesis) {
      loadVoices();
      
      // Chrome loads voices asynchronously
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
    
    return () => {
      // Stop speech when component unmounts
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);
  
  // Handle play/pause
  const togglePlay = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      toast({
        title: "Speech Synthesis Unavailable",
        description: "Your browser doesn't support speech synthesis.",
        variant: "destructive"
      });
      return;
    }
    
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    
    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(previewText);
    
    // Set voice properties
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.volume = volume / 100;
    utterance.rate = rate;
    utterance.pitch = pitch;
    
    // Event handlers
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => {
      setIsPlaying(false);
      toast({
        title: "Speech Error",
        description: "There was an error playing the voice preview.",
        variant: "destructive"
      });
    };
    
    // Store the utterance reference so we can cancel if needed
    utteranceRef.current = utterance;
    
    // Start speaking
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
  };
  
  // Handle stopping speech when component unmounts
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis && isPlaying) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlaying]);
  
  // Preview with current settings
  const saveSettings = () => {
    // In a real app, we would save these settings to user preferences
    toast({
      title: "Voice Settings Saved",
      description: "Your voice notification preferences have been updated.",
    });
    onClose();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium flex justify-between">
          <span>Preview Text</span>
          <span className="text-muted-foreground text-xs">{previewText.length} characters</span>
        </label>
        <textarea
          value={previewText}
          onChange={(e) => setPreviewText(e.target.value)}
          className="w-full h-24 p-2 border rounded-md text-sm resize-none"
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Voice</label>
        <select
          className="w-full p-2 border rounded-md text-sm"
          value={selectedVoice?.name || ""}
          onChange={(e) => {
            const voice = availableVoices.find(v => v.name === e.target.value) || null;
            setSelectedVoice(voice);
          }}
        >
          {availableVoices.length === 0 ? (
            <option value="">No voices available</option>
          ) : (
            availableVoices.map(voice => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))
          )}
        </select>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Volume</label>
            <span className="text-xs text-muted-foreground">{volume}%</span>
          </div>
          <div className="flex items-center gap-4">
            <VolumeX className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={[volume]}
              min={0}
              max={100}
              step={5}
              onValueChange={(values) => setVolume(values[0])}
              className="flex-1"
            />
            <Volume2 className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Speed</label>
            <span className="text-xs text-muted-foreground">×{rate.toFixed(1)}</span>
          </div>
          <Slider
            value={[rate * 10]}
            min={5}
            max={25}
            step={1}
            onValueChange={(values) => setRate(values[0] / 10)}
            className="flex-1"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-medium">Pitch</label>
            <span className="text-xs text-muted-foreground">×{pitch.toFixed(1)}</span>
          </div>
          <Slider
            value={[pitch * 10]}
            min={5}
            max={20}
            step={1}
            onValueChange={(values) => setPitch(values[0] / 10)}
            className="flex-1"
          />
        </div>
      </div>
      
      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className={`flex items-center gap-2 ${
              isPlaying ? "bg-red-50 text-red-600 border-red-200" : "bg-indigo-50 text-indigo-600 border-indigo-200"
            }`}
            onClick={togglePlay}
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Preview</span>
              </>
            )}
          </Button>
          <Button onClick={saveSettings} className="bg-indigo-600 hover:bg-indigo-700 text-white">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VoicePreview;

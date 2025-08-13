'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../auth/AuthContext';
import { saveTeams, loadTeams, migrateGuestToUser } from '../utils/dataPersistence';
import { Team } from '../types';

interface SaveStatusProps {
  teams: Team[];
  onTeamsLoad: (teams: Team[]) => void;
}

export default function SaveStatus({ teams, onTeamsLoad }: SaveStatusProps) {
  const { user, isAuthenticated } = useAuth();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const hasLoadedRef = useRef(false);

  const handleSave = useCallback(async () => {
    if (teams.length === 0) return;
    
    setIsSaving(true);
    try {
      const success = saveTeams(teams, isAuthenticated, user?.id);
      if (success) {
        setLastSaved(new Date());
        setSaveMessage('Teams saved successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('Failed to save teams');
        setTimeout(() => setSaveMessage(''), 3000);
      }
    } catch {
      setSaveMessage('Error saving teams');
      setTimeout(() => setSaveMessage(''), 3000);
    } finally {
      setIsSaving(false);
    }
  }, [teams, isAuthenticated, user?.id]);

  const handleLoad = useCallback(async () => {
    // Only load once to prevent infinite loops
    if (hasLoadedRef.current) return;
    
    try {
      let loadedTeams = loadTeams(isAuthenticated, user?.id);
      
      if (isAuthenticated && user?.id && !loadedTeams) {
        // Try to migrate guest data to user account
        loadedTeams = migrateGuestToUser(user.id);
      }
      
      if (loadedTeams) {
        onTeamsLoad(loadedTeams);
        setLastSaved(new Date());
        setSaveMessage('Teams loaded successfully!');
        setTimeout(() => setSaveMessage(''), 3000);
      }
      
      hasLoadedRef.current = true;
    } catch {
      console.error('Error loading teams');
      hasLoadedRef.current = true;
    }
  }, [isAuthenticated, user?.id, onTeamsLoad]);

  // Auto-save when teams change (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (teams.length > 0) {
        handleSave();
      }
    }, 2000); // Save after 2 seconds of no changes

    return () => clearTimeout(timeoutId);
  }, [teams, handleSave]);

  // Load teams on mount (only once)
  useEffect(() => {
    if (!hasLoadedRef.current) {
      handleLoad();
    }
  }, [handleLoad]);

  const handleManualSave = () => {
    handleSave();
  };

  return (
    <div className="fixed top-4 left-4 z-20">
      <div className="bg-gray-700 border-2 border-gray-800 rounded-lg p-3 text-white">
        <div className="text-xs font-bold mb-1">SAVE STATUS</div>
        
        {isAuthenticated ? (
          <div className="space-y-2">
            <div className="text-green-400 text-xs">
              {lastSaved ? `Last saved: ${lastSaved.toLocaleTimeString()}` : 'Not saved yet'}
            </div>
            <button
              onClick={handleManualSave}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-1 px-2 rounded text-xs border border-green-800"
            >
              {isSaving ? 'SAVING...' : 'SAVE NOW'}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-yellow-400 text-xs">Guest mode - data not saved</div>
            <div className="text-xs text-gray-300">Sign in to save your progress</div>
          </div>
        )}
        
        {saveMessage && (
          <div className="mt-2 text-xs bg-gray-600 px-2 py-1 rounded">
            {saveMessage}
          </div>
        )}
      </div>
    </div>
  );
}

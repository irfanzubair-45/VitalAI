import React from 'react';
import { Dialog } from '@reach/dialog';
import '@reach/dialog/styles.css';

interface ConsentModalProps {
  isOpen: boolean;
  onAccept: () => void;
  onDecline: () => void;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({ isOpen, onAccept, onDecline }) => {
  return (
    <Dialog isOpen={isOpen} onDismiss={onDecline} aria-label="Data Consent">
      <h2 className="text-xl font-semibold mb-4">Data Consent</h2>
      <p className="mb-4">
        By uploading your medical report, you consent to the processing of the data for the purpose of generating AI‑assisted health insights. The data will be stored encrypted and will not be shared with any third parties.
      </p>
      <div className="flex justify-end space-x-2">
        <button
          onClick={onDecline}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Decline
        </button>
        <button
          onClick={onAccept}
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700"
        >
          Accept & Continue
        </button>
      </div>
    </Dialog>
  );
};


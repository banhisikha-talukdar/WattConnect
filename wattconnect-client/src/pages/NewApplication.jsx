import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { ArrowLeft } from 'lucide-react';
import { AuthContext } from "../context/AuthContext";

export default function NewApplication() {
  const { token } = useContext(AuthContext); 
  const backLink = token ? '/customer/dashboard' : '/';
  
  return (
    <div className="flex h-screen bg-[#f4f6fa]">
      <main className="flex-1 px-4 sm:px-8 pt-15 pb-10 overflow-y-auto relative">
        <div className="flex justify-end mb-4">
          <Link to={backLink}
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Link>
        </div>
        <h1 className="text-2xl font-bold mb-6">To apply for new electricity connection</h1>
        <section className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Required Documents are as follows :</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Latest Passport Size Photo of the Applicant (jpeg or png)</li>
            <li>Proof of Identity (Voter ID / Passport / Driving License / Ration Card / BPL Card / PAN / Aadhaar / Local Authority ID)</li>
            <li>Residential Address Proof (DL / Bank Passbook / Aadhaar / Ration Card / Passport / Electricity Bill / Local Certificate)</li>
            <li>Proof of Legal Occupation (Holding No., Lease/Rent/Sale Deed)</li>
            <li>Affidavit from land owner with No Objection and optional Indemnity Bond (if not owner)</li>
            <li>Test Report from Authorized Electrical Contractor/Supervisor</li>
            <li>Standard Agreement Form</li>
            <li>Additional documents for online HT connection</li>
          </ul>
        </section>
        
        <p className="text-sm text-gray-600 mt-4">
          Note: All uploaded documents must be self-attested. Originals may be requested during inspection.
        </p>
        
        <div className="mt-6 mb-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
          <Link
            to="/new-connection-form"
            className="bg-[#1b7ce4] hover:bg-[#1561b3] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Apply for New Connection
          </Link>

          <Link to="#" onClick={(e) => {
              e.preventDefault();
              window.open("/track-my-application", "_blank", "noopener,noreferrer");
            }}
            className="bg-[#38c79b] hover:bg-[#299474] text-black font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Track my submitted application
          </Link>
        </div>
      </main>
    </div>
  );
}
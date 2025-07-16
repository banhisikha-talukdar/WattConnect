import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Adjust path if needed

export default function NewApplication() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleBack = () => {
    if (token) {
      navigate('/customer/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex h-screen bg-[#f4f6fa]">
      <main className="flex-1 px-4 sm:px-8 pt-6 pb-10 overflow-y-auto relative">
        {/* Back Option at Top */}
        <div onClick={handleBack} className="absolute top-6 right-6 text-blue-600 hover:text-gray-400 cursor-pointer">
          ← Back
        </div>

        <h1 className="text-2xl font-bold mb-6">
          Apply for New Electricity Connection
        </h1>

        <section className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Required Documents for New Electricity Connection
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Latest Passport Size Photo of the Applicant (jpeg or png)</li>
            <li>
              Proof of Identity (Voter ID / Passport / Driving License / Ration
              Card / BPL Card / PAN / Aadhaar / Local Authority ID)
            </li>
            <li>
              Residential Address Proof (DL / Bank Passbook / Aadhaar / Ration
              Card / Passport / Electricity Bill / Local Certificate)
            </li>
            <li>
              Proof of Legal Occupation (Holding No., Lease/Rent/Sale Deed)
            </li>
            <li>
              Affidavit from land owner with No Objection and optional Indemnity
              Bond (if not owner)
            </li>
            <li>
              Test Report from Authorized Electrical Contractor/Supervisor
            </li>
            <li>Standard Agreement Form</li>
            <li>Additional documents for online HT connection</li>
          </ul>
        </section>

        <p className="text-sm text-gray-600 mt-4">
          Note: All uploaded documents must be self-attested. Originals may be
          requested during inspection.
        </p>

        <div className="flex flex-wrap gap-4 mt-6 mb-8">
          <Link
            to="/new-connection-form"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Apply for New Connection
          </Link>

          <Link
            to="#"
            onClick={(e) => {
              e.preventDefault();
              window.open('/track-my-application', '_blank', 'noopener,noreferrer');
            }}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Track My Application
          </Link>
        </div>
      </main>
    </div>
  );
}

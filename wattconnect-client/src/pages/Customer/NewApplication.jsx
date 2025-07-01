import Navbar from '../../components/Navbar';
import { Link } from 'react-router-dom';

export default function NewApplication() {
  return (
    <div className="flex h-screen bg-[#f4f6fa]">
      <Navbar type="customer" />
      <main className="flex-1 px-4 sm:px-8 pt-15 pb-10 overflow-y-auto relative">
        <h1 className="text-2xl font-bold mb-6">Apply for New Electricity Connection</h1>

        <section className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">Required Documents for New Electricity Connection</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Latest Passport Size Photo of the Applicant (jpeg or png)</li>
            <li>Proof of Identity (Voter ID / Passport / Driving License / Ration Card / BPL Card / PAN / Aadhaar / Local Authority ID)</li>
            <li>Residential Address Proof (DL / Bank Passbook / Aadhaar / Ration Card / Passport / Electricity Bill / Local Certificate)</li>
            <li>Proof of Legal Occupation (Holding No., Lease/Rent/Sale Deed)</li>
            <li>Affidavit from land owner with No Objection and optional Indemnity Bond (if not owner)</li>
            <li>Test Report from Authorized Electrical Contractor/Supervisor</li>
            <li> Standard Agreement Form</li>
            <li> Additional documents for online HT connection</li>
          </ul>
        </section>
        <p className="text-sm text-gray-600 mt-4">
          Note: All uploaded documents must be self-attested. Originals may be requested during inspection.
        </p>
        <div className="mt-6">
          <Link
            to="/customer/new-connection-form" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Apply for New Connection
          </Link>
        </div>
      </main>
    </div>
  );
}

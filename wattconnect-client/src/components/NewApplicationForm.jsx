import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";
import { Upload, X, FileText, CheckCircle, RotateCcw, Eye, ArrowLeft } from 'lucide-react';

export default function NewApplication() {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(token ? "/customer/dashboard" : "/");
  };

  const [formData, setFormData] = useState({
    district: '',
    subdivision: '',
    appliedCategory: '',
    appliedLoad: '',
    name: '', 
    fatherName: '',
    area: '',
    villageOrTown: '',
    postOffice: '',
    policeStation: '',
    district: '', 
    pinCode: '',
    mobileNumber: '',
    declaration: false
  });

  const [files, setFiles] = useState({
    identityProof: null, 
    addressProof: null,
    legalOccupationProof: null, 
    testReport: null,
    passportPhoto: null, 
    affidavitOrNOC: null, 
    agreementForm: null,  
    htAdditionalDocs: null 
  });

  const assamDistricts = [
    "BAJALI", "BAKSA", "BARPETA", "BISWANATH", "BONGAIGAON",
    "CACHAR", "CHARAIDEO", "CHIRANG", "DARRANG", "DHEMAJI",
    "DHUBRI", "DIBRUGARH", "DIMA HASAO", "GOALPARA", "GOLAGHAT",
    "HAILAKANDI", "HOJAI", "JORHAT", "KAMRUP-M", "KAMRUP-R",
    "KARBI ANGLONG", "KARIMGANJ", "KOKRAJHAR", "LAKHIMPUR", "MAJULI",
    "MORIGAON", "NAGAON", "NALBARI", "SIVASAGAR", "SONITPUR",
    "SOUTH SALMARA MANKACHAR", "TAMULPUR", "TINSUKIA", "UDALGURI", "WEST KARBI ANGLONG"
  ];

  const subdivisionMap = {
    'KAMRUP-M': [
      "021-AMINGAON", "030-AZARA", "009-BASISTHA", "010-CAPITAL",
      "014-CHANDMARI", "001-FANCEBAZAR", "003-FATASHIL", "011-GARBHANGA",
      "006-IRCA GEC 1", "023-JALUKBARI", "002-KALAPAHAR", "029-MIRZA",
      "015-NARENGI", "004-PALTANBAZAR", "013-SONAPUR", "005-ULUBARI",
      "016-UZANBAZAR", "017-ZOO ROAD"
    ],
    'DIBRUGARH': [
      "220-BORDUBI", "207-DIBRUGARH-I", "208-DIBRUGARH-II", "209-DIBRUGARH-III",
      "210-IRCA DIBRUGARH", "201-MORAN", "219-NAHARKATIA", "221-NAMRUP",
      "204-TINGKHONG", "217-TINSUKIA-III"
    ],
    'JORHAT': [
      "172-DERGAON", "175-IRCA JORHAT", "170-JORHAT-I", "171-JORHAT-II",
      "173-JORHAT-III", "189-KAKOJAN", "177-MARIANI", "188-TEOK", "176-TITABOR"
    ]
  };

  const loadCategories = [
    { code: '43', name: 'LT I JEEVAN DHARA (DOMESTIC)', minLoad: 0.01, maxLoad: 0.5 },
    { code: '44', name: 'LT I JEEVAN DHARA (COMMERCIAL)', minLoad: 0.01, maxLoad: 0.5 },
    { code: '45', name: 'LT I JEEVAN DHARA (GENERAL)', minLoad: 0.01, maxLoad: 0.5 },
    { code: '46', name: 'LT II DOMESTIC A', minLoad: 0.06, maxLoad: 4.99 },
    { code: '47', name: 'LT III DOMESTIC B', minLoad: 5.0, maxLoad: 30.0 },
    { code: '48', name: 'LT IV COMMERCIAL', minLoad: 0.1, maxLoad: 30.0 },
    { code: '49', name: 'LT V(A) GENERAL PURPOSE (OTHER)', minLoad: 0.1, maxLoad: 30.0 },
    { code: '51', name: 'LT VII AGRICULTURE', minLoad: 0.1, maxLoad: 30.0 },
    { code: '52', name: 'LT VIII SMALL INDUSTRIES (RURAL)', minLoad: 0.1, maxLoad: 30.0 },
    { code: '53', name: 'LT VIII SMALL INDUSTRIES (URBAN)', minLoad: 0.1, maxLoad: 30.0 },
    { code: '54', name: 'LT IX TEMPORARY SUPPLY (DOMESTIC)', minLoad: 0.1, maxLoad: 30.0 },
    { code: '55', name: 'LT IX TEMPORARY SUPPLY (NON DOMESTIC)', minLoad: 0.1, maxLoad: 30.0 },
    { code: '69', name: 'LT IX TEMPORARY SUPPLY (AGRICULTURE)', minLoad: 0.1, maxLoad: 30.0 },
    { code: '72', name: 'LT ELECTRIC VEHICLES CHARGING', minLoad: 0.1, maxLoad: 30.0 },
    { code: '75', name: 'LT V(B) GENERAL PURPOSE (EDUCATION)', minLoad: 0.1, maxLoad: 30.0 },
    { code: '56-77', name: 'HT Categories (For Online applications)', minLoad: 30, maxLoad: 150 }
  ];

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const getSelectedCategory = () => {
    return loadCategories.find(cat => cat.code === formData.appliedCategory);
  };

  const validateLoadRange = (load) => {
    const selectedCategory = getSelectedCategory();
    if (!selectedCategory) return true;
    
    const numLoad = parseFloat(load);
    return numLoad >= selectedCategory.minLoad && numLoad <= selectedCategory.maxLoad;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'appliedCategory') {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        appliedLoad: '' 
      }));
      setErrors((prev) => ({ ...prev, appliedLoad: '' }));
    } else if (name === 'appliedLoad') {
      const selectedCategory = getSelectedCategory();
      if (selectedCategory && value) {
        const numLoad = parseFloat(value);
        if (!validateLoadRange(value)) {
          setErrors((prev) => ({
            ...prev,
            appliedLoad: `Load must be between ${selectedCategory.minLoad} and ${selectedCategory.maxLoad} KW for this category`
          }));
        } else {
          setErrors((prev) => ({ ...prev, appliedLoad: '' }));
        }
      }
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };


  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file && file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        [fileType]: 'File size must be less than 10MB'
      }));
      return;
    }
    setFiles((prev) => ({ ...prev, [fileType]: file }));
    setErrors((prev) => ({ ...prev, [fileType]: '' }));
  };

  const removeFile = (fileType) => {
    setFiles((prev) => ({ ...prev, [fileType]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'district', 'subdivision', 'appliedCategory', 'appliedLoad',
      'name', 'fatherName', 'area', 'villageOrTown', 
      'postOffice', 'policeStation', 'district',
      'pinCode', 'mobileNumber'
    ];

    requiredFields.forEach((field) => {
      if (!formData[field]) newErrors[field] = 'This field is required';
    });

    if (formData.pinCode && !/^\d{6}$/.test(formData.pinCode)) {
      newErrors.pinCode = 'Pin code must be 6 digits';
    }

    if (formData.mobileNumber && !/^\d{10}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Mobile number must be 10 digits';
    }

    if (!formData.appliedLoad || isNaN(formData.appliedLoad) || formData.appliedLoad <= 0) {
      newErrors.appliedLoad = 'Applied load must be a positive number';
    } else if (!validateLoadRange(formData.appliedLoad)) {
      const selectedCategory = getSelectedCategory();
      if (selectedCategory) {
        newErrors.appliedLoad = `Load must be between ${selectedCategory.minLoad} and ${selectedCategory.maxLoad} KW for this category`;
      }
    }

    const requiredFiles = ['identityProof', 'addressProof', 'legalOccupationProof', 'testReport', 'passportPhoto', 'affidavitOrNOC', 'agreementForm'];
    requiredFiles.forEach((fileType) => {
      if (!files[fileType]) newErrors[fileType] = 'This file is required';
    });

    if (!formData.declaration) {
      newErrors.declaration = 'You must accept the declaration';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitStatus('Please fill the required fields.');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('');

    const payload = new FormData();

    payload.append('district', formData.district);
    payload.append('subdivision', formData.subdivision);
    payload.append('appliedCategory', formData.appliedCategory);
    payload.append('appliedLoad', formData.appliedLoad);

    payload.append('consumerDetails[name]', formData.name);
    payload.append('consumerDetails[fatherName]', formData.fatherName);

    payload.append('addressDetails[area]', formData.area);
    payload.append('addressDetails[villageOrTown]', formData.villageOrTown);
    payload.append('addressDetails[postOffice]', formData.postOffice);
    payload.append('addressDetails[policeStation]', formData.policeStation);
    payload.append('addressDetails[district]', formData.district);
    payload.append('addressDetails[pinCode]', formData.pinCode);
    payload.append('addressDetails[mobileNumber]', formData.mobileNumber);

    Object.entries(files).forEach(([key, file]) => {
      if (file) {
        payload.append(key, file);
      }
    });

    try {
      const res = await fetch("http://localhost:5000/api/new-connection", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: payload,
      });

      if (!res.ok) {
        let errorMessage;
        try {
          const errorData = await res.json();
          errorMessage = errorData.error || `Error! ${res.status}`;
        } catch {
          errorMessage = `Error! ${res.status}`;
        }
        throw new Error(errorMessage);
      }

      const result = await res.json();

      setSubmitStatus("Application submitted successfully!");
      console.log("Submitted:", result);

      setSubmitStatus("success");

    } catch (err) {
      console.error("Submission error:", err);
      setSubmitStatus(`Submission failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      district: '',
      subdivision: '',
      appliedCategory: '',
      appliedLoad: '',
      name: '', 
      fatherName: '',
      area: '',
      villageOrTown: '', 
      postOffice: '',
      policeStation: '',
      district: '',
      pinCode: '',
      mobileNumber: '',
      declaration: false
    });
    setFiles({
      identityProof: null, 
      addressProof: null,
      legalOccupationProof: null, 
      testReport: null,
      passportPhoto: null, 
      affidavitOrNOC: null, 
      agreementForm: null,
      htAdditionalDocs: null 
    });
    setErrors({});
    setSubmitStatus('');
  };

  const handleVerify = () => {
    if (validateForm()) {
      setSubmitStatus("Form verified successfully! Ready to submit.");
    } else {
      setSubmitStatus("Please fill the required fields.");
    }
  };

  const FileUpload = ({ label, fileType, required = true }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-400 transition-colors">
        {files[fileType] ? (
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-blue-500 mr-2" />
              <span className="text-sm text-gray-700 truncate">{files[fileType].name}</span>
            </div>
            <button
              type="button"
              onClick={() => removeFile(fileType)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <label className="cursor-pointer flex flex-col items-center">
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-600">Click to upload file</span>
            <span className="text-xs text-gray-500 mt-1">Max size: 10MB</span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => handleFileChange(e, fileType)}
              accept=".jpg,.jpeg,.png"
            />
          </label>
        )}
      </div>
      {errors[fileType] && <p className="text-red-500 text-xs mt-1">{errors[fileType]}</p>}
    </div>
  );

  return (
    submitStatus === "success" ? (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 text-center px-4">
      <CheckCircle className="w-16 h-16 text-green-600 mb-4" />
      <h1 className="text-3xl font-bold text-green-800 mb-2">
        Your application has been submitted successfully!
      </h1>
      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <button
          onClick={() => navigate("/new-connection-form")}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Apply for another connection
        </button>
        <button
          onClick={() => window.open("/track-my-application", "_blank", "noopener,noreferrer")}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Track my application
        </button>
        <button onClick={handleGoBack}
          className="bg-gray-400 hover:bg-gray-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Go back
        </button>
      </div>
    </div>
  ) : (
    <form onSubmit={handleSubmit} className="min-h-screen w-full bg-gray-50 py-6 px-6 overflow-y-auto">

      <div className="flex justify-end mb-4">
        <Link
          to="/new-application"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Link>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">New Connection Application</h1>
          <p className="text-gray-600">
            Fill out the form below to apply for a new electricity connection
          </p>
        </div>

        <div className="space-y-8">
    
          <div className="bg-blue-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">District <span className="text-red-500">*</span></label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>-- Select District --</option>
                  {assamDistricts.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subdivision <span className="text-red-500">*</span>
                </label>
                <select
                  name="subdivision"
                  value={formData.subdivision}
                  onChange={handleInputChange}
                  disabled={!subdivisionMap[formData.district]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select Subdivision --</option>
                  {subdivisionMap[formData.district]?.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
                {errors.subdivision && <p className="text-red-500 text-xs mt-1">{errors.subdivision}</p>}
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Application Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
            <label className="block text-sm font-medium mb-2">Applied Category <span className="text-red-500">*</span></label>
            <select
              name="appliedCategory"
              value={formData.appliedCategory}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">Select category</option>
              {loadCategories.map((cat) => (
                <option key={cat.code} value={cat.code}>{cat.name}</option>
              ))}
            </select>
            {errors.appliedCategory && (
            <p className="text-red-500 text-xs mt-1">{errors.appliedCategory}</p>
             )}
            </div>

            <div>
            <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Applied Load (KW) <span className="text-red-500">*</span></label>
              <a href="https://drive.google.com/file/d/1BfmeZVeQ1oJBRV8EQEyiuXvGKqeHA1yw/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                View allowed load of categories
              </a>
              </div>
            <input
              type="number"
              step="0.01"
              name="appliedLoad"
              value={formData.appliedLoad}
              onChange={handleInputChange}
              min={getSelectedCategory()?.minLoad || 0}
              max={getSelectedCategory()?.maxLoad || 150}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={getSelectedCategory() ? `Range: ${getSelectedCategory().minLoad} - ${getSelectedCategory().maxLoad} KW` : "Select category first"}
              disabled={!formData.appliedCategory}
            />
              {errors.appliedLoad && (
              <p className="text-red-500 text-xs mt-1">{errors.appliedLoad}</p>
               )}
              {getSelectedCategory() && (
                <p className="text-sm text-gray-600 mt-1">
                  Allowed range: {getSelectedCategory().minLoad} - {getSelectedCategory().maxLoad} KW
                </p>
              )}
            </div>
            </div>
          </div>

          <div className="bg-yellow-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Consumer Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="name" 
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter full name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Father's Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Enter father's name"
                />
                {errors.fatherName && <p className="text-red-500 text-xs mt-1">{errors.fatherName}</p>}
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Address of the Premises</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'area', label: 'Area' },
                { name: 'villageOrTown', label: 'Village/Town' }, 
                { name: 'postOffice', label: 'Post Office' },
                { name: 'policeStation', label: 'Police Station' },
                { name: 'district', label: 'District' },
                { name: 'pinCode', label: 'Pin Code', max: 6 }
              ].map(({ name, label, max }) => (
                <div key={name}>
                  <label className="block text-sm font-medium mb-2">{label} <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    name={name}
                    value={formData[name]}
                    onChange={handleInputChange}
                    maxLength={max}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder={`Enter ${label.toLowerCase()}`}
                  />
                  {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name]}</p>}
                </div>
              ))}
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">Mobile Number <span className="text-red-500">*</span></label>
              <input
                type="tel"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                maxLength="10"
                className="w-full md:w-1/2 px-3 py-2 border rounded-md"
                placeholder="Enter 10-digit mobile number"
              />
              {errors.mobileNumber && <p className="text-red-500 text-xs mt-1">{errors.mobileNumber}</p>}
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Upload Documents (Max size: 10MB each)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUpload label="Proof of Identity (Voter ID / Passport / Driving License / Ration Card / BPL Card / PAN / Aadhaar / Local Authority ID)" fileType="identityProof" />
              <FileUpload label="Residential Address Proof (DL / Bank Passbook / Aadhaar / Ration Card / Passport / Electricity Bill / Local Certificate)" fileType="addressProof" />
              <FileUpload label="Proof of Legal Occupation (Holding No., Lease/Rent/Sale Deed)" fileType="legalOccupationProof" />
              <FileUpload label="Test Report from Electrical Contractor/Supervisor" fileType="testReport" />
              <FileUpload label="Latest Passport Size Photo of the Applicant (jpeg, jpg or png)" fileType="passportPhoto" />
              <FileUpload label="Affidavit from land owner with No Objection and optional Indemnity Bond (if not owner)" fileType="affidavitOrNOC" />
              <FileUpload label="Standard Agreement Form" fileType="agreementForm" />
              <FileUpload label="Additional Documents for Online HT Connection" fileType="htAdditionalDocs" required={false} />
            </div>
          </div>

          <div className="bg-red-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Declaration</h2>
            <div className="bg-white p-4 rounded border text-sm text-gray-700 mb-4">
              <p>
                I / We declare that the informations given above is true to the best of my knowledge and belief.I / We further confirm that 
                there are no orders of Court / Govt. restricting electricity connection in the premises, that I / We will remit electricity 
                dues during every billing cycle and also as and when demanded as per the applicable electricity tariff, and other charges, 
                that I / We will own the responsibility of security and safety of the meter, cut-out and the installation thereafter.
                I / We will not indulge in any misuse of power and will take all necessary steps in the premises for the efficient use of 
                power and to stop its wastage.APDCL will not be responsible for any untoward happening arising out of unauthorised extension 
                of load, mishandling of the electrical appliances and wire etc.I / We will abide by the rules and regulations of APDCL. 
                In case of any wrong information furnished by me / us intentionally or unintentionally, APDCL will be at liberty not to release 
                service connection and forfeit the money if deposited or disconnect the line.
              </p>
            </div>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                name="declaration"
                checked={formData.declaration}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                I accept the above declaration <span className="text-red-500">*</span>
              </label>
            </div>
            {errors.declaration && (
              <p className="text-red-500 text-xs mt-1">{errors.declaration}</p>
            )}
          </div>

          {submitStatus && (
            <div className={`p-4 rounded-lg text-center ${
              submitStatus.toLowerCase().includes('success')
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}>
              {submitStatus}
            </div>
          )}

          <div className="flex justify-center space-x-4 pt-6">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </button>
            <button
              type="button"
              onClick={handleVerify}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center"
            >
              <Eye className="h-4 w-4 mr-2" />
              Verify
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
    )
  );
}
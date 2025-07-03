import { useNavigate } from "react-router-dom";
import MeterForm from "../../components/MeterForm";

export default function ScheduleMyMeterForm() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f2f6fc] p-6">
      <MeterForm
        onSuccess={(formData) => {
          const submittedAt = new Date().toLocaleString();
          navigate("/customer/my-meter-scheduling", {
            state: {
              message: `Request for scheduled meter installation visit done successfully!`,
              submittedAt,
              formData,
            },
          });
        }}
      />
    </div>
  );
}

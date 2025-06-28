import { useNavigate } from "react-router-dom";
import MeterForm from "../../components/MeterForm";

export default function ScheduleMyMeterForm() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f2f6fc] p-6">
      <MeterForm
        onSuccess={(formData) => {
          const submittedAt = new Date().toLocaleString();
          navigate("/customer/my_meteer_scheduling", {
            state: {
              message: `Meter Installation visit scheduled for ${formData.preferredDate}!`,
              submittedAt,
              formData,
            },
          });
        }}
      />
    </div>
  );
}

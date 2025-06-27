import { useNavigate } from "react-router-dom";
import EngineerForm from "../../components/EngineerForm";

export default function ScheduleMyEngineerForm() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f2f6fc] p-6">
      <EngineerForm
        onSuccess={(formData) => {
          const submittedAt = new Date().toLocaleString();
          navigate("/customer/my_engineer_scheduling", {
            state: {
              message: `Engineer visit scheduled for ${formData.preferredDate}!`,
              submittedAt,
              formData,
            },
          });
        }}
      />
    </div>
  );
}

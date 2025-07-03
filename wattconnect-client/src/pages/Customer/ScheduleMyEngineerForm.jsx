import { useNavigate } from "react-router-dom";
import EngineerForm from "../../components/EngineerForm";

export default function ScheduleMyEngineerForm() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f2f6fc] p-6">
      <EngineerForm
        onSuccess={(formData) => {
          const submittedAt = new Date().toLocaleString();
          navigate("/customer/my-engineer-scheduling", {
            state: {
              message: `Request for scheduled engineer visit done successfully!`,
              submittedAt,
              formData,
            },
          });
        }}
      />
    </div>
  );
}

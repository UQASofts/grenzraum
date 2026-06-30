import BayernCloudDashboard from "../../components/BayernCloudDashboard";
import { useData } from "../../context/DataContext";

export default function DashboardBayernCloud() {
  const { apiLogs } = useData();

  return (
    <BayernCloudDashboard
      apiLogs={apiLogs}
      onTriggerSync={() => {
        console.log("BayernCloud sync triggered");
      }}
      language="en"
    />
  );
}

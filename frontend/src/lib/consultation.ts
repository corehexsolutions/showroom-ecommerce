import api from "@/lib/axios";

export interface ConsultationData {
  name: string;
  phone: string;
  email?: string;
  sofaType?: string;
  approximateSize?: string;
  description: string;
  selectedFinish?: string;
}

export const submitConsultation = async (
  data: ConsultationData
) => {
  const response = await api.post("/consultation", data);

  return response.data;
};
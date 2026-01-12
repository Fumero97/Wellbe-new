import axios from 'axios';
export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? ""; // Empty string means same origin (localhost:3000)

export const LOGIN_ENDPOINT = `${API_BASE_URL}/api/user/login`;

export interface FrontEndUserDTO {
    nome?: string;
    cognome?: string;
    email?: string;
    consulente: boolean;
    ruolo: string;
}

export interface SedeDTO {
    id: number;
    denominazione: string;
}

export interface QuestionarioDTO {
    id: number;
    categoria?: string | null;
    titolo?: string | null;
}

export interface PartnerSurveyDTO {
    id: number;
    title: string;

    dataOraAssegnazione?: string | null;
    dataOraChiusura?: string | null;

    evento?: string | null;
    token?: string | null;

    sede?: SedeDTO | null;
    questionario?: QuestionarioDTO | null;
}

export interface DomandaConcatenataDTO {
    idDomandaConcatenata: number;
    gruppo: string;
    ambito: string;
    testoDomanda: string;
    avgPresente: number;
    avgPassato: number;
    deltaAssoluto: number;
    deltaPercentuale: number;
}

export interface ClusterDescriptionDTO {
    groupname: string;
    descrizione: string;
}
export interface MediaTrasversaleDTO {
    ambito: string;
    gruppo: string;
    avgPresente: number;
    avgPassato: number;
    avgTrasversale: number;
}

export interface ClimaBarChartDTO {
    clusterDomandaId: number;
    clusterDomandaTesto: string;
    possibileRispostaId: number;
    possibileRispostaTesto: string;
    avgPresente: number | null;
    avgPassato: number | null;
    nPresente: number;
    nPassato: number;
}

export async function getMe(): Promise<FrontEndUserDTO | null> {
    try {
        const { data } = await axios.get<FrontEndUserDTO>(
            `${API_BASE_URL}/api/user/me`,
              {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                withCredentials: true,
            }
        );
        return data;
    } catch (e: unknown){
        console.error("getMe error:", e);
        return null;
    }
}

export async function getOrganizations(): Promise<Array<unknown> | []> {
    try {
        const { data } = await axios.get<Array<unknown>>(
            `${API_BASE_URL}/api/organizations/to_manage`,
            {
                withCredentials: true,
                timeout: 5000,
            }
        );
        return data;
    } catch (error: unknown) {
        console.error("getOrganizations error:", error);
        return [];
    }
}



export async function getRadarDataBySurvey(id_assegnazione : number ): Promise<Array<unknown> | []> {
    try {
        const { data } = await axios.get<Array<unknown>>(
            `${API_BASE_URL}/report/radar/${id_assegnazione}`,
            {
                withCredentials: true,
                timeout: 5000,
            }
        );
        return data;
    } catch (error: unknown) {
        console.error("getRadar Information error:", error);
        return [];
    }
}

export async function getDescrizioneAssegnazione(id: number): Promise<string> {
    try {
        const { data } = await axios.get(
            `${API_BASE_URL}/report/assegnazione/${id}/descrizione`,
            {
                withCredentials: true,
                timeout: 5000,
            }
        );
        return data;
    } catch (error: unknown) {
        console.error("getRadar Information error:", error);
        return "";
    }
}

export async function getSurveysPartner(id_azienda: string): Promise<PartnerSurveyDTO[]> {
    try {
        const { data } = await axios.get<PartnerSurveyDTO[]>(
            `${API_BASE_URL}/partner/storico-questionari/${id_azienda}`,
            {
                withCredentials: true,
                timeout: 5000,
            }
        );
        return data;
    } catch (error: unknown) {
        console.error("getSurveysPartner error:", error);
        return [];
    }
}

export async function getSediAzienda(id_azienda: string): Promise<SedeDTO[]> {
    try {
        const { data } = await axios.get<SedeDTO[]>(
            `${API_BASE_URL}/partner/sedi-azienda/${id_azienda}`,
            {
                withCredentials: true,
                timeout: 5000,
            }
        );
        return data;
    } catch (error: unknown) {
        console.error("getSediAzienda error:", error);
        return [];
    }
}

export async function getQuestionariAzienda(id_azienda: string): Promise<QuestionarioDTO[]> {
    try {
        const { data } = await axios.get<QuestionarioDTO[]>(
            `${API_BASE_URL}/partner/questionari-azienda/${id_azienda}`,
            {
                withCredentials: true,
                timeout: 5000,
            }
        );
        return data;
    } catch (error: unknown) {
        console.error("getQuestionariAzienda error:", error);
        return [];
    }
}

export async function createSurveyPartner(params: {
    title: string;
    sedeId: number;
    questionarioId: number;
    evento?: string;
}): Promise<PartnerSurveyDTO | null> {
    try {
        const { data } = await axios.post<PartnerSurveyDTO>(
            `${API_BASE_URL}/partner/survey`,
            params,
            {
                withCredentials: true,
                timeout: 5000,
            }
        );
        return data;
    } catch (error: unknown) {
        console.error("createSurveyPartner error:", error);
        return null;
    }
}

export async function updateSurveyPartner(
    id: number,
    params: {
        title: string;
        sedeId?: number;
        questionarioId?: number;
        evento?: string;
    }
): Promise<PartnerSurveyDTO | null> {
    try {
        const { data } = await axios.put<PartnerSurveyDTO>(
            `${API_BASE_URL}/partner/survey/${id}`,
            params,
            {
                withCredentials: true,
                timeout: 5000,
            }
        );
        return data;
    } catch (error: unknown) {
        console.error("updateSurveyPartner error:", error);
        return null;
    }
}

export async function publishSurveyPartner(id: number): Promise<PartnerSurveyDTO | null> {
    try {
        const { data } = await axios.post<PartnerSurveyDTO>(
            `${API_BASE_URL}/partner/survey/${id}/publish`,
            {},
            {
                withCredentials: true,
                timeout: 5000,
            }
        );
        return data;
    } catch (error: unknown) {
        console.error("publishSurveyPartner error:", error);
        return null;
    }
}

export async function closeSurveyPartner(id: number): Promise<PartnerSurveyDTO | null> {
    try {
        const { data } = await axios.post<PartnerSurveyDTO>(
            `${API_BASE_URL}/partner/survey/${id}/close`,
            {},
            {
                withCredentials: true,
                timeout: 5000,
            }
        );
        return data;
    } catch (error: unknown) {
        console.error("closeSurveyPartner error:", error);
        return null;
    }
}

export async function deleteSurveyPartner(id: number): Promise<boolean> {
    try {
        await axios.delete(
            `${API_BASE_URL}/partner/survey/${id}`,
            {
                withCredentials: true,
                timeout: 5000,
            }
        );
        return true;
    } catch (error: unknown) {
        console.error("deleteSurveyPartner error:", error);
        return false;
    }
}

export async function getMediaTrasversale(id_assegnazione: number): Promise<MediaTrasversaleDTO[]> {
    try {
        const { data } = await axios.get<MediaTrasversaleDTO[]>(
            `${API_BASE_URL}/report/media-trasversale/${id_assegnazione}`,
            {
                withCredentials: true,
                timeout: 5000,
            }
        );
        return data;
    } catch (error: unknown) {
        console.error("getMediaTrasversale error:", error);
        return [];
    }
}

export async function getDomandeConcatenate(id_assegnazione: number): Promise<DomandaConcatenataDTO[]> {
    try {
        const { data } = await axios.get<DomandaConcatenataDTO[]>(
            `${API_BASE_URL}/report/domande-concatenate/${id_assegnazione}`,
            {
                withCredentials: true,
                timeout: 5000,
            }
        );
        return data;
    } catch (error: unknown) {
        console.error("getDomandeConcatenate error:", error);
        return [];
    }
}

export async function getClusterDescriptions(id_assegnazione: number): Promise<ClusterDescriptionDTO[]> {
    try {
        const { data } = await axios.get<ClusterDescriptionDTO[]>(
            `${API_BASE_URL}/report/cluster-descriptions/${id_assegnazione}`,
            {
                withCredentials: true,
                timeout: 5000,
            }
        );
        return data;
    } catch (error: unknown) {
        console.error("getClusterDescriptions error:", error);
        return [];
    }
}

export async function getClimaBarChartData(
    id_assegnazione: number,
    gruppo?: string,
    ambito?: string
): Promise<ClimaBarChartDTO[]> {
    try {
        const params = new URLSearchParams();
        if (gruppo) params.append('gruppo', gruppo);
        if (ambito) params.append('ambito', ambito);

        const { data } = await axios.get<ClimaBarChartDTO[]>(
            `${API_BASE_URL}/report/clima-bar-chart/${id_assegnazione}${params.toString() ? `?${params.toString()}` : ''}`,
            {
                withCredentials: true,
                timeout: 5000,
            }
        );
        return data;
    } catch (error: unknown) {
        console.error("getClimaBarChartData error:", error);
        return [];
    }
} // ✅ CHIUSURA CORRETTA

// ======================
// SAVE APIs
// ======================

export async function saveDescrizioneAssegnazione(
    id: number,
    descrizione: string
): Promise<boolean> {
    try {
        await axios.put(
            `${API_BASE_URL}/report/assegnazione/${id}/descrizione`,
            { descrizione },
            { withCredentials: true, timeout: 5000 }
        );
        return true;
    } catch (error: unknown) {
        console.error("saveDescrizioneAssegnazione error:", error);
        return false;
    }
}

export async function saveClusterDescription(
    id_assegnazione: number,
    groupname: string,
    descrizione: string
): Promise<boolean> {
    try {
        await axios.put(
            `${API_BASE_URL}/report/cluster-descriptions/${id_assegnazione}`,
            { groupname, descrizione },
            { withCredentials: true, timeout: 5000 }
        );
        return true;
    } catch (error: unknown) {
        console.error("saveClusterDescription error:", error);
        return false;
    }
}

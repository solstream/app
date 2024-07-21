export interface EarnModel {
    id: string;
    title: string;
    image: string;
    action: string;
    reward?: number;
    active?: boolean;
    url: string;
    conditions?: string;
    link?: string;
}

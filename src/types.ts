export interface CmsPage {
  id: string;
  slug: string;
  title: string;
  route: string;
  status: 'DRAFT' | 'PUBLISHED';
  body: string;
  updatedAt: string;
}

export interface Review {
  id?: string;
  name: string;
  text: string;
  position: string;
  avatarUrl: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  service?: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'LOST';
  createdAt: string;
}

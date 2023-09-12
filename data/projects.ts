import { generate } from 'randomstring';

interface PostData {
  id: number;
  title: string;
}

export interface ProjectData {
  url: string;
  name: string;
  id: number;
  posts: PostData[];
  tags: string[];
  levels: string[];
}

export interface CreateProjectData {
  url: string;
  name: string;
  categories: string[];
  description: string;
}

export const projects: Record<string, ProjectData> = {
  project1: {
    url: '/project1',
    name: 'project1',
    id: 1,
    tags: [],
    posts: [{ id: 123, title: 'New post' }],
    levels: [],
  },
  project2: {
    url: '/project2',
    name: 'project2',
    id: 2,
    tags: [],
    posts: [],
    levels: [],
  },
  project3: {
    url: '/project3',
    name: 'project3',
    id: 3,
    tags: [],
    posts: [],
    levels: [],
  },
};

export const createRandomNewProject = (categories: string[]): CreateProjectData => {
  const prefix = generate(7);
  return {
    name: `${prefix}-name`,
    url: `${prefix.toLowerCase()}_url`,
    categories,
    description: `${prefix}-description`,
  };
};

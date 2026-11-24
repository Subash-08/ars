export type StoryKind = "testimonial" | "delivery";

export type CustomerStory = {
  id: string;
  customerName: string;
  location: string;
  testimonial: string;
  kind: StoryKind;
  imageUrl: string;
  order: number;
  isActive: boolean;
  isDemo: boolean;
};

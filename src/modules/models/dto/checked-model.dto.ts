export class CreateCheckedModelDto {
  name: string;
  hasContent: boolean;
  modelId: number;
}

export class UpdateCheckedModelDto {
  name?: string;
  hasContent?: boolean;
  modelId?: number;
}

export class CheckedModelResponseDto {
  id: number;
  name: string;
  created_at: string;
  hasContent: boolean;
  modelId: number;
}

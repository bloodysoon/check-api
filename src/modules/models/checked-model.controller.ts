import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  ParseBoolPipe,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { CheckedModelService } from './checked-model.service';
import { getAllModels, VideoModel } from '../../supa-api.service';
import {
  CreateCheckedModelDto,
  UpdateCheckedModelDto,
  CheckedModelResponseDto,
} from './dto/checked-model.dto';

@Controller('checked-models')
export class CheckedModelController {
  private readonly logger = new Logger(CheckedModelController.name);

  constructor(private readonly checkedModelService: CheckedModelService) {}

  @Post()
  async create(@Body() createDto: CreateCheckedModelDto): Promise<CheckedModelResponseDto> {
    try {
      const result = await this.checkedModelService.create(createDto);
      return result as CheckedModelResponseDto;
    } catch (error) {
      this.logger.error('Failed to create checked model', error);
      throw new HttpException(
        error.message || 'Failed to create checked model',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  async findAll(
    @Query('hasContent', new ParseBoolPipe({ optional: true })) hasContent?: boolean,
  ): Promise<CheckedModelResponseDto[]> {
    try {
      const result = await this.checkedModelService.findAll(hasContent);
      return result as CheckedModelResponseDto[];
    } catch (error) {
      this.logger.error('Failed to fetch checked models', error);
      throw new HttpException(
        error.message || 'Failed to fetch checked models',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('available-models')
  async getAvailableModels(): Promise<VideoModel[]> {
    console.log("get available models");
    try {
      const models = await getAllModels();
      if (!models) {
        throw new HttpException('Failed to fetch models from database', HttpStatus.INTERNAL_SERVER_ERROR);
      }
      return models;
    } catch (error) {
      this.logger.error('Failed to fetch available models', error);
      throw new HttpException(
        error.message || 'Failed to fetch available models',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<CheckedModelResponseDto> {
    try {
      const result = await this.checkedModelService.findOne(id);
      if (!result) {
        throw new HttpException('Checked model not found', HttpStatus.NOT_FOUND);
      }
      return result as CheckedModelResponseDto;
    } catch (error) {
      this.logger.error('Failed to fetch checked model', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to fetch checked model',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateCheckedModelDto,
  ): Promise<CheckedModelResponseDto> {
    try {
      const result = await this.checkedModelService.update(id, updateDto);
      if (!result) {
        throw new HttpException('Checked model not found', HttpStatus.NOT_FOUND);
      }
      return result as CheckedModelResponseDto;
    } catch (error) {
      this.logger.error('Failed to update checked model', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to update checked model',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    try {
      const result = await this.checkedModelService.remove(id);
      if (!result) {
        throw new HttpException('Checked model not found', HttpStatus.NOT_FOUND);
      }
      return { message: 'Checked model deleted successfully' };
    } catch (error) {
      this.logger.error('Failed to delete checked model', error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        error.message || 'Failed to delete checked model',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('by-model/:modelId')
  async findByModelId(@Param('modelId', ParseIntPipe) modelId: number): Promise<CheckedModelResponseDto[]> {
    try {
      const result = await this.checkedModelService.findByModelId(modelId);
      return result as CheckedModelResponseDto[];
    } catch (error) {
      this.logger.error('Failed to fetch checked models by modelId', error);
      throw new HttpException(
        error.message || 'Failed to fetch checked models by modelId',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

import { Controller, Post, Body, Get, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TitlesService } from './titles.service';
import { CreateTitleDto } from './dto/create-title.dto';
import { UpdateTitleDto } from './dto/update-title.dto';
import { TitleIdDto } from './dto/title-id.dto';
import { Title } from './interfaces/title.interface';
import { TitleAllDto } from './dto/find-all.dto';

@ApiTags('titles')
@ApiBearerAuth('access-token')
@Controller('titles')
export class TitlesController {
  constructor(private readonly service: TitlesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo título' })
  @ApiResponse({ status: 201, description: 'Título creado', type: CreateTitleDto })
  async create(@Body() dto: CreateTitleDto): Promise<Title> {
    return this.service.create(dto, dto.accessToken);
  }

  @Post('getAll')
  @ApiOperation({ summary: 'Listar todos los títulos' })
  async findAll(@Body() dto: TitleAllDto): Promise<Title[]> {
    return this.service.findAll(dto.accessToken);
  }

  @Post('get')
  @ApiOperation({ summary: 'Obtener un título por ID' })
  async findOne(@Body() dto: TitleIdDto): Promise<Title | null> {
    return this.service.findOne(dto.id, dto.accessToken);
  }

  @Put()
  @ApiOperation({ summary: 'Actualizar un título' })
  async update(@Body() dto: UpdateTitleDto): Promise<Title> {
    return this.service.update(dto);
  }

  @Delete()
  @ApiOperation({ summary: 'Eliminar un título' })
  async remove(@Body() dto: TitleIdDto): Promise<Title> {
    return this.service.remove(dto.id, dto.accessToken);
  }
}
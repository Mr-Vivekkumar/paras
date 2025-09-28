import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { MenuService } from './menu.service';
import { Menu } from '../database/entities/menu.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';

describe('MenuService', () => {
  let service: MenuService;
  let repository: Repository<Menu>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuService,
        {
          provide: getRepositoryToken(Menu),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<MenuService>(MenuService);
    repository = module.get<Repository<Menu>>(getRepositoryToken(Menu));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new menu', async () => {
      const createMenuDto: CreateMenuDto = { name: 'Test Menu' };
      const expectedMenu = { id: '1', name: 'Test Menu', created_at: new Date(), updated_at: new Date() };

      mockRepository.create.mockReturnValue(expectedMenu);
      mockRepository.save.mockResolvedValue(expectedMenu);

      const result = await service.create(createMenuDto);

      expect(mockRepository.create).toHaveBeenCalledWith({ name: 'Test Menu' });
      expect(mockRepository.save).toHaveBeenCalledWith(expectedMenu);
      expect(result).toEqual(expectedMenu);
    });
  });

  describe('findAll', () => {
    it('should return all menus', async () => {
      const expectedMenus = [
        { id: '1', name: 'Menu 1', created_at: new Date(), updated_at: new Date() },
        { id: '2', name: 'Menu 2', created_at: new Date(), updated_at: new Date() },
      ];

      mockRepository.find.mockResolvedValue(expectedMenus);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalledWith({ relations: ['items'] });
      expect(result).toEqual(expectedMenus);
    });
  });

  describe('findOne', () => {
    it('should return a menu by id', async () => {
      const expectedMenu = { id: '1', name: 'Test Menu', created_at: new Date(), updated_at: new Date() };

      mockRepository.findOne.mockResolvedValue(expectedMenu);

      const result = await service.findOne('1');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['items'],
      });
      expect(result).toEqual(expectedMenu);
    });

    it('should throw NotFoundException when menu not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a menu', async () => {
      const existingMenu = { id: '1', name: 'Old Name', created_at: new Date(), updated_at: new Date() };
      const updateMenuDto: UpdateMenuDto = { name: 'New Name' };
      const updatedMenu = { ...existingMenu, name: 'New Name', updated_at: new Date() };

      mockRepository.findOne.mockResolvedValue(existingMenu);
      mockRepository.save.mockResolvedValue(updatedMenu);

      const result = await service.update('1', updateMenuDto);

      expect(result.name).toBe('New Name');
      expect(result.updated_at).toBeDefined();
    });
  });

  describe('remove', () => {
    it('should remove a menu', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove('1');

      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when menu not found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});

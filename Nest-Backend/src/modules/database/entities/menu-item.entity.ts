import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Menu } from './menu.entity';

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'uuid' })
  menu_id: string;

  // Expose parent_id via RelationId, and map TreeParent to use the same column
  @Column({ type: 'uuid', nullable: true })
  parent_id: string | null;

  @Column({ type: 'int', default: 0 })
  depth: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => Menu, (menu) => menu.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menu_id' })
  menu: Menu;

  // Tree relations removed; hierarchy will be constructed in transformer from flat items
}

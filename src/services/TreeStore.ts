export interface TreeItem {
  id: string | number;
  parent: string | number | null;
  label: string;
  [key: string]: unknown;
}

export type ItemId = string | number;


export class TreeStore {
  private items: TreeItem[];
  private idMap: Map<ItemId, TreeItem>;

  constructor(treeItems: TreeItem[]) {
    this.items = [...treeItems];
    this.idMap = new Map();
    this.buildIndex();
  }

  private buildIndex(): void {
    this.idMap.clear();
    for(const item of this.items) {
      this.idMap.set(item.id, item);
    }
  }

  getAll(): TreeItem[] {
    return this.items;
  }

  getItem(id: ItemId) {
    return this.idMap.get(id);
  }

  getChildren(id: ItemId): TreeItem[] {
    return this.items.filter(item => String(item.parent) === String(id));
  }

  getAllChildren(id: ItemId): TreeItem[] {
    const result: TreeItem[] = [];
    const stack: ItemId[] = [id];

    while (stack.length > 0) {
      const currentId = stack.pop()!;
      const children = this.getChildren(currentId);
      for (const child of children) {
        result.push(child);
        stack.push(child.id);
      }
    }

    return result;
  }

  getAllParents(id: ItemId): TreeItem[] {
    const result: TreeItem[] = [];
    let currentId: ItemId | null = id;

    while (currentId !== null) {
      const item = this.idMap.get(currentId);
      if (item) {
        result.push(item);
        currentId = item.parent;
      } else {
        break;
      }
    }

    return result.reverse(); // от корня к элементу
  }

  addItem(item: TreeItem): void {
    this.items.push(item);
    this.idMap.set(item.id, item);
  }

  removeItem(id: ItemId): void {
    // собираем всех потомков для удаления
    const allToRemove = [id, ...this.getAllChildren(id).map(item => item.id)];

    this.items = this.items.filter(item => !allToRemove.includes(item.id));
    this.buildIndex(); // перестраиваем индекс
  }

  updateItem(updatedItem: TreeItem): void {
    const index = this.items.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
      this.items[index] = { ...this.items[index], ...updatedItem };
      this.idMap.set(updatedItem.id, this.items[index]);
    }
  }
}
import { remove } from 'lodash';

export class ObjectList<T> {
  private m_Objects: T[] = [];
  public cleanup(): void {
    remove(this.m_Objects, (value: T) => value.mustBeDestroyed());
  }
}

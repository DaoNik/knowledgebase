import { ChangeDetectionStrategy, Component } from '@angular/core';

interface AdminFunc {
  name: string;
  route: string;
}

const mockAdminPages: AdminFunc[] = [
  {
    name: 'Модерация статей',
    route: 'moderate',
  },
  {
    name: 'В ожидании',
    route: 'not-listed',
  },
  {
    name: 'Назначение ролей',
    route: 'roles',
  }
];

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminPanelComponent {
  adminPages: AdminFunc[] = mockAdminPages;
}

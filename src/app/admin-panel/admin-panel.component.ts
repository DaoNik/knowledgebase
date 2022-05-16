import { Component, OnInit } from '@angular/core';

interface AdminFunc {
  name: string;
  route: string;
};

const mockAdminPages: AdminFunc[] = [
  {
    name: 'Модерация статей',
    route: 'moderate'
  },
  {
    name: 'В ожидании',
    route: 'not-listed'
  },
  {
    name: 'Назначение ролей',
    route: 'roles'
  },
  {
    name: 'Еще кнопка',
    route: 'moderate'
  },
  {
    name: 'Еще кнопка',
    route: 'moderate'
  },
  {
    name: 'Еще кнопка',
    route: 'moderate'
  }
];

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {

  adminPages: AdminFunc[] = mockAdminPages;

  constructor() { }

  ngOnInit(): void {
  }

}

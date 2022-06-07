import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-role-moderation',
  templateUrl: './role-moderation.component.html',
  styleUrls: ['./role-moderation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleModerationComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteClubDialogComponent } from './delete-club-dialog.component';

describe('DeleteClubDialogComponent', () => {
  let component: DeleteClubDialogComponent;
  let fixture: ComponentFixture<DeleteClubDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteClubDialogComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DeleteClubDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

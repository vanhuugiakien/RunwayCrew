import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { NbToastrService } from '@nebular/theme';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ProfileService } from 'src/app/services/profile.service';
import { RoleService } from 'src/app/services/role.service';
import { Role } from 'src/models/role.model';
import { RegistrationProfile } from 'src/models/user-profile.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit {
  selectedGender = '';
  selectedRoles: Array<string> = [];
  usr: string = "Hello World";

  emailControl!: FormControl;
  nameControl!: FormControl;
  addressControl!: FormControl;
  genderControl!: FormControl;
  dobControl!: FormControl;
  phoneNumberControl!: FormControl;
  selectedRolesControl!: FormControl;
  facebookControl!: FormControl;
  linkInControl!: FormControl;

  roles: any[] = [];

  registration: RegistrationProfile = {
    email: '',
    name: '',
    address: '',
    gender: '',
    dob: 0,
    phoneNumber: '',
    selectedRoles: [],
    facebook: '',
    linkIn: '',
  };
  public defaultEmail: any;
  constructor(
    private profileService: ProfileService,
    private toast: NbToastrService,
    private router: Router,
    private auth: AngularFireAuth,
    private roleService: RoleService
  ) {
    this.auth.authState.subscribe((state) => {
      if (state) {
        this.defaultEmail = state.email;
        // console.log(this.defaultEmail);
      }
    })
    this.roleService.getAll().subscribe((roles) => {
      this.roles.length = 0;
      this.roles.push(...roles.map((r) => { return { ...r, selected: false } }));
    })
  }

  rules = [
    '1. Ưu tiên hàng đầu của việc tham gia Runway Club là học hỏi thêm nhiều kiến thức, kỹ năng và tạo thêm nhiều mối quan hệ xã hội.',
    '2. Runway Club hoạt động phi lợi nhuận, được bảo trợ bởi Công ty TNHH Dịch Vụ Đào tạo và Giải pháp ITSS (aka. ITSS). Vì thế, các hoạt động của mỗi thành viên là tình nguyện và vì cộng đồng. Đôi khi, các thành viên sẽ có trợ cấp cho công việc của mình, tuy nhiên nó hoàn toàn phụ thuộc vào những gì bạn đã làm được.',
    '3. Các thành viên tham gia Runway Club không cần đóng bất kỳ khoản tiền nào.',
  ];

  async ngOnInit() {

    this.emailControl = new FormControl(this.registration.email, [
      Validators.required,
    ]);
    this.nameControl = new FormControl(
      this.registration.name,
      Validators.required
    );
    this.addressControl = new FormControl(this.registration.address);
    this.genderControl = new FormControl(this.selectedGender);
    this.dobControl = new FormControl(
      this.registration.dob,
      Validators.required
    );
    this.phoneNumberControl = new FormControl(
      this.registration.phoneNumber,
      Validators.required
    );
    this.selectedRolesControl = new FormControl(
      this.selectedRoles,
      Validators.required
    );
    this.facebookControl = new FormControl(this.registration.facebook);
    this.linkInControl = new FormControl(this.registration.linkIn);
    // });


  }

  onRoleSelected(role: any) {
    role.selected = !role.selected;
    if (role.selected) {
      if (this.selectedRoles.indexOf(role['name']) < 0) {
        this.selectedRoles.push(role['name']);
      }
    } else {
      let index = this.selectedRoles.findIndex(r =>
        r === role['name']
      );
      this.selectedRoles.splice(index, 1);
    }
  }

  async onRegistration() {
    if (this.nameControl.invalid || this.dobControl.invalid || this.phoneNumberControl.invalid) {
      this.toast.danger("Hãy kiểm tra thông tin lại một lần nữa nhé", "Đăng ký thất bại");
      return;
    }
    try {
      await this.profileService.create({
        address: this.addressControl.value,
        dob: this.dobControl.value,
        email: this.emailControl.value,
        gender: this.genderControl.value,
        phoneNumber: this.phoneNumberControl.value,
        selectedRoles: this.selectedRolesControl.value,
        facebook: this.facebookControl.value,
        linkIn: this.linkInControl.value,
        name: this.nameControl.value,
      });
      this.toast.success(`Welcome to Runway Club`, 'Success');
      this.router.navigate(['profile']);
    } catch (err) {
      this.toast.danger(err);
    }
  }
}

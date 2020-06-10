import { Component, OnInit } from '@angular/core';
import {  FormBuilder, Validators, FormArray } from '@angular/forms';
import { UserService, User } from "../../services/user.service"
import { AuthenticationService } from "../../services/authentication.service"

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {


  profileForm  =  this.formBuilder.group({
    djName:['', Validators.required ],
    communityName: ['',Validators.minLength(5)],
    cityName: ['',Validators.minLength(5)],
    imageUrl: ['',Validators.minLength(5)],
    playlistSets: this.formBuilder.array([])
  })
  currentUser:User;

  get playlistSets(){
    return this.profileForm.get('playlistSets') as FormArray;
  }

  constructor(private userService:UserService, private formBuilder:FormBuilder, private authen:AuthenticationService) {
     
   }

  async ngOnInit(){
    console.log('email verify', (await this.authen.auth.currentUser).emailVerified)
    this.currentUser = await this.userService.get()
    console.log(this.currentUser);
    this.profileForm.patchValue(  {
        djName:this.currentUser.name,
        cityName:this.currentUser.community['city'],
        communityName:this.currentUser.community['name'],
        imageUrl:this.currentUser.picture,
    })
    if(this.currentUser.playlist_sets && this.currentUser.playlist_sets.length > 0)
      this.currentUser.playlist_sets.forEach(set => {
        this.playlistSets.push(this.formBuilder.control(set, Validators.required));
      })
    else
      this.playlistSets.push(this.formBuilder.control('', Validators.required));
    console.log(this.profileForm.value);
  }

  addPlaylistSet(){
    this.playlistSets.push(this.formBuilder.control('', Validators.required));
  }

  removePlaySet(index:number){
    this.playlistSets.removeAt(index);
  }

  transform(){
     
     let u:User = {
       name:this.profileForm.value.djName,
       community:{
         city:this.profileForm.value.cityName,
         name:this.profileForm.value.communityName
       },
       level:this.currentUser.level,
       preference_tags:this.currentUser.preference_tags,
       picture:this.profileForm.value.imageUrl,
       playlist_sets:this.profileForm.value.playlistSets
     }
     return u;
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    
    this.userService.update(this.transform(), ['name', 'community', 'picture', 'playlist_sets'])
  }

}

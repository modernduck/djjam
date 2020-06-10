import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore'
import { SpotifyPlaylist } from "../services/spotify.interface"
import { AuthenticationService } from "./authentication.service"
import { Playlist } from "../models/Track"

export interface User{
  name?:string,
    picture?:string,
    level:number,
    preference_tags:Array<string>,
    exclude_tags?:Array<string>,
    playlist_sets?:Array<string>
    recent_playlists?:Array<{
        name:string,
        image:any,
        spotify_user_id:string,
        spotify_playlist_id:string
    }>
    playlist_set_map?:{
      [key:string]:Array<Playlist>
    }
  community:DocumentReference | { name:string, city:string}
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private authen:AuthenticationService, private firestore:AngularFirestore) { 

    
  }

  async get(userReference?:DocumentReference){
    let snap;
    if(userReference){
      snap = await userReference.get()
    }else{
      const user = await this.authen.auth.currentUser;
     snap = await this.firestore.collection('user').doc(user.uid).get().toPromise()
    }
    
    let u =  {
      ...snap.data(),
    } as User

    const citySnap = await (u.community as DocumentReference).get()
    u.community = citySnap.data() as  { name:string, city:string}
    return u;

  }

  async update(user:User, fields?:Array<string>){
    const id =  (await this.authen.auth.currentUser).uid;
    console.log(id, user, fields)
    let obj:any = {};
    if(fields)
      fields.forEach(field => obj[field] = user[field] );
    else
      obj = {...user};
    console.log(obj);
    if(obj['community']){  
        let result = await  this.firestore.collection('community') .doc(user.community['name']).get().toPromise()
        if(!result.exists)
          await this.firestore.collection('community') .doc(user.community['name']).set({
            name:user.community['name'],
            city:user.community['city']
          })
      obj['community'] = this.firestore.collection('community') .doc(user.community['name']).ref;
    }
    console.log('going to update', obj);
    return this.firestore.collection('user').doc(id).update(obj);
  }

  nameToSlug(str:string){
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
  }

  async addPlaylistsToSet(playlists:Array<SpotifyPlaylist>, setName:string){
    const id =  (await this.authen.auth.currentUser).uid;
     const newPlaylists = playlists.map(item => ({
      id:item.id,
      name:item.name,
      imageUrl:item.images[0].url
    }) as Playlist);
    console.log('going to save', newPlaylists);
    const obj:any = {playlist_set_map:{}};
    obj.playlist_set_map[this.nameToSlug(setName)] = newPlaylists;
    this.firestore.collection('user').doc(id).update(obj);
    return Promise.all(newPlaylists.map(item => this.firestore.collection('user').doc(id).collection('set').doc(item.id).set(item)));
  }

}

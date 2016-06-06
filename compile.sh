#ID NO PHONEGAP BUILD
id="1520918"
phonegap_user="faleconosco@conradoweb.com.br"
phonegap_pass="LUlu200725"
android_key_pass="123456"
android_id="93444"
ios_id=""
package="conradoweb.com.br.smrtfoodweb"
packageios="conradoweb.com.br.smrtfoodweb"
activity="smrtfoodweb"

#COMMIT NO GIT
clear 
echo "machine github.com  login webconrado \n password LUlu200725" > $HOME/.netrc
git diff --diff-filter=D --name-only -z | xargs -0 git rm
git add *
data=$(date)
#git checkout sandbox
git commit -m "Commit $data"
git push -u origin master
#git push -u origin sandbox

#PULL LATEST
current=$(pwd)
cd ~/Downloads
#DESTRAVA CHAVE ANDROID
#curl -u $phonegap_user:$phonegap_pass -d 'data={"key_pw":"'$android_key_pass'","keystore_pw":"'$android_key_pass'"}' -X PUT https://build.phonegap.com/api/v1/keys/android/$android_id
#COMPILA
google-chrome "https://build.phonegap.com/apps/$id/push"
sleep 90

#BAIXA E INSTALA NO IPHONE
#wget "https://build.phonegap.com/apps/$id/download/ios"
#ideviceinstaller -u $packageios
#ideviceinstaller -i ios
#rm ios
#cd $current

#BAIXA E INSTALA NO ANDROID
wget "https://build.phonegap.com/apps/$id/download/android"
adb uninstall $package
adb install -r android
rm android
cd $current

#LIGA A TELA, DEPOIS DESTRAVA
adb shell input keyevent 26
adb shell input keyevent 82

#RODA
adb shell am start -a android.intent.action.MAIN -n $package/.$activity

#DEBUGA O JAVASCRIPT
clear
adb logcat | grep INFO:CONSOLE

#TIRA SCREENSHOTS
#adb shell screencap -p | perl -pe 's/\x0D\x0A/\x0A/g' > screen.png

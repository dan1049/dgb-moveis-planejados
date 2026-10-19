# DGB Medidas — Android, iPhone e iPad

## Estado atual
- O app web está em `dgb-medidas/index.html`.
- Manifesto PWA, ícone SVG e service worker estão na mesma pasta.
- A pasta do app é separada do site principal da DGB.
- A configuração Capacitor está na raiz do repositório para gerar projetos nativos Android/iOS.

## Teste como aplicativo web
1. Publique a pasta `dgb-medidas` num host HTTPS.
2. No Android, abra o endereço no Chrome e use **Instalar app** ou **Adicionar à tela inicial**.
3. No iPhone/iPad, abra no Safari, toque em Compartilhar e escolha **Adicionar à Tela de Início**.

## Preparar pacote Android
Requer Node.js e Android Studio (ou ambiente de compilação compatível):
1. `npm install`
2. `npm run cap:init` (se ainda não existir `capacitor.config.ts` no checkout local, este comando não é necessário; a configuração já está versionada)
3. `npm run android:add`
4. `npm run cap:sync`
5. `npm run cap:open:android`
6. No Android Studio, gerar e assinar APK/AAB e testar em dispositivos reais.

## Preparar pacote iOS
Requer macOS com Xcode ou serviço de build em nuvem compatível com iOS:
1. `npm install`
2. `npm run ios:add`
3. `npm run cap:sync`
4. `npm run cap:open:ios`
5. Configurar assinatura Apple, testar iPhone e iPad, arquivar e enviar pelo Xcode/App Store Connect.

## Antes de publicar
- Testar cadastro, fotos, marcações, exclusão/edição e PDF em aparelhos reais.
- Confirmar persistência e backup dos dados; o armazenamento atual é local ao navegador/app e não sincroniza automaticamente entre aparelhos.
- Preparar política de privacidade, ícones e capturas de tela da loja.
- A publicação depende das contas e das análises das lojas. Este repositório não contém APK/AAB nem IPA assinados.

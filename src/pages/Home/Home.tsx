import style from './Home.module.scss'

import { useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { ReactComponent as ChangeIcon } from '../../assets/change.svg'

import { Button } from '../../components/Button/Button'
import { Footer } from '../../components/Footer/Footer'
import { Avatar } from '../../components/Avatar/Avatar'
import { InviteAlert } from '../../components/InviteAlert/InviteAlert'
import { Header } from '../../components/Header/Header'

import { inviterAvatar, inviterName } from '../../devConstants'
import { useUser } from '../../hooks/useUser'
import { Loader } from '../../components/Loader/Loader'
import { useCreateLobbyMutation } from '../../services/gameApi'

// TODO: make a separate general file for random avatars and nicks
const avatars: string[] = [
  'https://cdn.discordapp.com/attachments/1101177259643125820/1101180013493112902/helpus.png',
  'https://cdn.discordapp.com/attachments/1101177259643125820/1101178601753280522/fy4bd2jQfPI.png',
  'https://cdn.discordapp.com/attachments/1101177259643125820/1101179298225848320/tZGkLpiqz6E.png',
  'https://cdn.discordapp.com/attachments/1101177259643125820/1101179234967375902/hr5bQdjRIa8.png',
  'https://cdn.discordapp.com/attachments/1101177259643125820/1101178210395365487/3eIoltWByjg.png'
]

const nicknames: string[] = [
  'MemeCooler',
  'MemeMaster',
  'Noob',
  'LolzGuru',
  'FunnyFalcon',
  'JokesterJay',
  'CrazyComedian',
  'LaughingLion',
  'SillyMonkey',
  'HilariousHippo',
  'WittyWhale',
  'CheekyChimp',
  'GigglingGorilla',
  'PunnyPanda',
  'HumorHero',
  'QuirkyQuokka',
  'JollyJester',
  'ChucklingCheetah',
  'AmusingAlpaca',
  'WhimsicalWombat',
  'GoofyGiraffe',
  'SarcasticSloth',
  'GrumpyCatFan',
  'DogeLover',
  'RickrollMaster',
  'KeyboardCatFanatic',
  'PepeTheFrog',
  'SuccessKidFan',
  'HarambeForever',
  'CryingJordanFan',
  'NyanCatAdmirer',
  'TrollFaceGuru',
  'DistractedBoyfriend',
  'BadLuckBrianFan',
  'HideThePainHarold',
  'EvilKermit',
  'SaltBaeFanatic',
  'DrakeMemeEnthusiast',
  'BlinkingWhiteGuy',
  'SpongebobMemeKing',
  'SurprisedPikachuLover',
  'ArthurFistMemeFan',
  'PewDiePieFan',
  'BendydoodleCabbagepatch',
  'ButterscotchCrumblebatch',
  'BumblebeeCucumberpants',
  'BandywinksCrumblebatch',
  'ButtermilkCrumblepatch',
  'BingleberryCumberbund',
  'BumblesnatchCrumpetbatch',
  'ButtercupCrumblepants',
  'BundlesnuffCrumplesnatch',
  'BandywagCabbagepants',
  'MrTwister',
  'LordBurger',
  'PizzaMaster',
  'Amogus',
  'Marshak'
]

const randomNickname = () => nicknames[Math.floor(Math.random() * nicknames.length)]

const randomAvatar = () => avatars[Math.floor(Math.random() * avatars.length)]

const validationSchema = Yup.object({
  nicknameInput: Yup.string().required('Напишите хоть что-нибудь 👉👈')
})

export const Home = () => {
  const { user, isLoading, isAnonymous, setName, setAvatar } = useUser()
  const [createLobby, { isLoading: isCreatingLobby }] = useCreateLobbyMutation()
  const navigate = useNavigate()
  const hasInvite = false

  const formik = useFormik({
    initialValues: {
      // TODO: fix nickname updating when getingt back from InvitePage
      nicknameInput: randomNickname()
    },
    validationSchema,
    onSubmit: () => { /**/ }
  })

  if (isLoading || user === null) {
    return <Loader />
  }

  const createLobbyHandler = async () => {
    isAnonymous && setName(formik.values.nicknameInput)
    const lobbyInfo = await createLobby(user.userId).unwrap()
      .catch(() => null)

    if (!lobbyInfo?.inviteCode) return
    navigate('/game', {
      state: lobbyInfo.inviteCode
    })
  }

  const renderProfile = () => {
    if (isAnonymous) {
      return (
        <>
          <Avatar avatarUrl={user.avatarUrl} size='normal'>
            <button className={style.avatarChangeButton} onClick={() => setAvatar(randomAvatar())}>
              <ChangeIcon />
            </button>
          </Avatar>
          <div className={style.containerInput}>
            <span className={style.title}>ВЫБЕРИ МЕМ-АВУ И ПСЕВДОНИМ</span>
            <div className={style.containerForHomePageValidationErrorInspiredByEVT}></div>
            <input
              className={`${style.inputName} ${formik.errors.nicknameInput ? style.invalidInput : ''}`}
              value={formik.values.nicknameInput}
              name="nicknameInput"
              onChange={(e) => { formik.handleChange(e) }}
              onBlur={formik.handleBlur}
              type='text'
              placeholder={formik.touched.nicknameInput && formik.errors.nicknameInput ? formik.errors.nicknameInput : ''}
              autoComplete="off"
              required
            />
          </div>
        </>
      )
    }

    return (
      <div className={style.profileContainer}>
        <Avatar avatarUrl={user.avatarUrl} size='normal' />

        <div className={style.textContainer}>
          <div className={style.nickname}>{user.name}</div>
          <div className={style.premiumStatus}>PREMIUM STATUS: <div className={style.pepe}></div></div>
        </div>
      </div>
    )
  }

  return (
    <div className={style.container}>
      <Header />

      <div className={style.content}>
        {hasInvite && <InviteAlert avatarUrl={inviterAvatar} inviter={inviterName} />}

        {renderProfile()}

        <div className={style.containerLoginButton}>
          <Button disabled={!formik.values.nicknameInput || isCreatingLobby} onClick={createLobbyHandler}>Создать лобби</Button>
          <Button disabled={!formik.values.nicknameInput || isCreatingLobby} onClick={() => navigate('/invite')}>Войти по коду</Button>
        </div>

        {isAnonymous && <div className={style.containerLoginButton}>
          <Button onClick={() => navigate('/auth/discord')}>Войти через Discord</Button>
        </div>}
      </div>

      <Footer />
    </div>
  )
}

export default Home

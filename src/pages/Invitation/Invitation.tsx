import style from './Invitation.module.scss'
import { ReactComponent as ChangeIcon } from '../../assets/change.svg'

import { useFormik } from 'formik'
import * as Yup from 'yup'

import { Button } from '../../components/Button/Button'
import { Footer } from '../../components/Footer/Footer'
import { Avatar } from '../../components/Avatar/Avatar'
import { InviteAlert } from '../../components/InviteAlert/InviteAlert'
import { Header } from '../../components/Header/Header'
import { Loader } from '../../components/Loader/Loader'

import { skipToken } from '@reduxjs/toolkit/query/react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useUser } from '../../hooks/useUser'
import { useGetLobbyInfoQuery } from '../../services/gameApi'

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

export const Invitation = () => {
  const { code } = useParams()
  const navigate = useNavigate()

  const { user, isAnonymous, isLoading: userLoading, setName, setAvatar } = useUser()
  const { data: lobbyInfo, isLoading: lobbyLoading, isError } = useGetLobbyInfoQuery(code ?? skipToken)

  const formik = useFormik({
    initialValues: {
      nicknameInput: randomNickname()
    },
    validationSchema,
    onSubmit: () => { /**/ }
  })

  if (!code) {
    return <Navigate to='/invite' />
  }

  if (userLoading || lobbyLoading) {
    return <Loader />
  }

  if (isError || !lobbyInfo) {
    return <Navigate to='/invite' />
  }

  // TODO: refactor to UserView and use as react component
  const renderUser = () => {
    if (!user) {
      return (
        <>
          Девиантное поведение приложения
        </>
      )
    }

    if (!isAnonymous) {
      return (
        <>
          <div className={style.avatarContainer}>
            <Avatar avatarUrl={user.avatarUrl} />
          </div>

          <span className={style.title}>ВЫ {user.name}</span>
        </>
      )
    }

    return (
      <>
        <Avatar avatarUrl={user.avatarUrl} size='normal'>
          <button className={style.avatarChangeButton} onClick={() => setAvatar(randomAvatar())}>
            <ChangeIcon />
          </button>
        </Avatar>

        <div className={style.containerInput}>
          <span className={style.title}>ВЫБЕРИ МЕМ-АВУ И ПСЕВДОНИМ</span>
          <input
            className={`${style.inputName} ${formik.errors.nicknameInput ? style.invalidInput : ''}`}
            value={formik.values.nicknameInput}
            name="nicknameInput"
            onChange={(e) => { formik.handleChange(e) }}
            onBlur={formik.handleBlur}
            placeholder={formik.touched.nicknameInput && formik.errors.nicknameInput ? formik.errors.nicknameInput : ''}
            autoComplete="off"
            type='text'
            required
          />
        </div>
      </>
    )
  }

  const enterLobby = () => {
    isAnonymous && setName(formik.values.nicknameInput)
    navigate('/game', {
      state: code
    })
  }

  return (
    <div className={style.container}>
      <Header />

      <div className={style.content}>
        <InviteAlert
          avatarUrl={lobbyInfo.owner.avatarUrl}
          inviter={lobbyInfo.owner.name}
        />

        {renderUser()}

        <div className={style.buttonContainer}>
          <Button disabled={!formik.values.nicknameInput || lobbyLoading} onClick={enterLobby}>Войти в лобби</Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default Invitation

import { useState } from 'react'
import { Header } from '../../components/Header'
import background from '../../assets/background.png'
import './styles.css'
import ItemList from '../../components/ItemList'

function App() {
  const [user, setUser] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [repos, setRepos] = useState(null)

  const handleGetData = async () => {
    const userData = await fetch(`https://api.github.com/users/${user}`)
    const newUser = await userData.json()
    console.log(`Fetching user data from: https://api.github.com/users/${user}`)

    if (newUser.login) {
      const { avatar_url, name, bio, login } = newUser
      setCurrentUser({ avatar_url, name, bio, login })

      const reposData = await fetch(
        `https://api.github.com/users/${user}/repos`
      )
      const newRepos = await reposData.json()

      if (newRepos.length) {
        const sortedRepos = newRepos.sort((a, b) => {
          return new Date(b.updated_at) - new Date(a.updated_at)
        })

        setRepos(sortedRepos)
      }
    } else {
      setCurrentUser(null)
      setRepos(null)
      return
    }
  }

  return (
    <div className="App">
      <Header />
      <div className="conteudo">
        <img src={background} className="background" alt="background app"></img>
        <div className="info">
          <div>
            <input
              name="usuario"
              value={user}
              onChange={event => setUser(event.target.value)}
              placeholder="@username"
            />
            <button onClick={handleGetData}>Buscar</button>
          </div>
          {currentUser?.login ? (
            <>
              <div className="perfil">
                <img
                  src={currentUser.avatar_url}
                  className="profile"
                  alt="foto de perfil"
                />
                <div>
                  <h3>{currentUser.name ? currentUser.name : 'sem nome'}</h3>
                  <span>{'@' + currentUser.login}</span>
                  <p>{currentUser.bio ? currentUser.bio : 'sem bio'}</p>
                </div>
              </div>
              <hr />
            </>
          ) : null}
          {repos?.length ? (
            <div>
              <h4 className="repositorio">Repositórios</h4>
              {repos.map(repo => (
                <ItemList
                  key={repo.id}
                  title={repo.name}
                  description={
                    <>
                      {repo.description ? repo.description : 'Sem descrição'}{' '}
                      <br />
                      <a
                        className="link"
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Click aqui para ir ao Repositório
                      </a>
                    </>
                  }
                />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default App

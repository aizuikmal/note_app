import Head from 'next/head'
import Link from 'next/link'

const Home = () => (
	<div className="container">
		<Head>
			<title>Notes</title>
			<link rel="icon" href="/favicon.ico" />
		</Head>

		<main>
			<h1 className="title">
				Hello.
			</h1>

			<div className="pages">
				<ul>
					<li><Link href="/notes/new"><a>NOTES</a></Link></li>
				</ul>
			</div>

		</main>
		<style jsx>{`
			.container { min-height:100vh; display:flex; flex-direction:column; justify-content:center; align-items:center; padding:0 .5rem;  }
			main { flex:1; display:flex; flex-direction:column; justify-content:center; align-items:center; padding:5rem 0;  }
			a { color:inherit; text-decoration:none;  }
			.title a { color:#0070f3; text-decoration:none;  }
			.title a:hover,.title a:focus,.title a:active { text-decoration:underline;  }
			.title { line-height:1.15; font-size:4rem; margin:0;  }
			.title,.description { text-align:center;  }
			.description { line-height:1.5; font-size:1.5rem;  }
			code { width:170px; border:1px dashed #444; background:#000; border-radius:5px; line-height:25px; font-size:1.1rem; font-family:monospace; color:#29FE14; padding:20px;  }
			.pages { margin-top:30px;}
			.pages ul { display:flex; margin:0px; padding:0px; }
			.pages ul li { margin:0px; padding:0px; list-style:none; }
			.pages ul li a {}
			.pages ul li a:hover { color:#29FE14; }
		`}</style>

		<style jsx global>{`
			html,body { font-family:0 BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif; background-color:#000; color:#FFF; margin:0; padding:0;  }
			* { box-sizing:border-box;  }
		`}</style>
	</div>
)

export default Home

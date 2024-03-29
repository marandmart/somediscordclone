// https://github.com/vercel/styled-jsx
// usar o css no javascript

// pode-se usar mais de um h1 na página
// colocando eles dentro de uma tag article

import { Box, Button, Text, TextField, Image } from '@skynexui/components';
import { useState } from 'react';
import { useRouter } from 'next/router';
import appConfig from '../config.json';

function Titulo(props) {
    const titulo = props.children;
    const Tag = props.tag || "h1";
    return (
        <>
            <Tag>{titulo}</Tag>
            <style jsx>{`
                ${Tag} {
                color: ${appConfig.theme.colors.neutrals["000"]};
                font-size: 24px;
                font-weight: 600;
            }
      `}</style>
        </>
    );
}


export default function PaginaInicial() {
    const [username, setUsername] = useState('marandmart');
    // variável de roteamento que pode-se utilizar para redirecionar para outra página sem reload
    const roteamento = useRouter();

    return (
        <>
            <Box
                styleSheet={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: appConfig.theme.colors.primary["000"],
                    backgroundImage: `url(${appConfig.theme.background})`,
                    backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'bottom right', backgroundBlendMode: 'multiply',
                }}
            >
                <Box
                    styleSheet={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexDirection: {
                            xs: 'column',
                            sm: 'row',
                        },
                        width: '100%', maxWidth: '700px',
                        borderRadius: '5px', padding: '32px', margin: '16px',
                        boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                        backgroundColor: appConfig.theme.colors.neutrals[700],
                    }}
                >
                    {/* Formulário */}
                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            width: { xs: '100%', sm: '50%' }, textAlign: 'center', marginBottom: '32px',
                        }}
                        onSubmit={function (event) {
                            event.preventDefault();
                            // uso do método push para carregar os conteúdos do arquivo chat.js na página atual
                            // roteamento possuí varios outros métodos dentro dele. checar documentação
                            roteamento.push(`/chat?username=${username}`);
                        }}
                    >
                        <Titulo tag="h2">Boas vindas!</Titulo>
                        <Text variant="body3" styleSheet={{ marginBottom: '32px', color: appConfig.theme.colors.neutrals[300] }}>
                            {appConfig.name}
                        </Text>

                        <TextField
                            fullWidth
                            textFieldColors={{
                                neutral: {
                                    textColor: appConfig.theme.colors.neutrals[200],
                                    mainColor: appConfig.theme.colors.neutrals[900],
                                    mainColorHighlight: appConfig.theme.colors.primary[500],
                                    backgroundColor: appConfig.theme.colors.neutrals[800],
                                },
                            }}
                            onChange={function (event) {
                                const valorDoCampo = event.target.value;
                                if (valorDoCampo.length > 2) setUsername(valorDoCampo);
                            }}
                        />
                        <Button
                            type='submit'
                            label='Entrar'
                            fullWidth
                            buttonColors={{
                                contrastColor: appConfig.theme.colors.neutrals["000"],
                                mainColor: appConfig.theme.colors.primary[500],
                                mainColorLight: appConfig.theme.colors.primary[400],
                                mainColorStrong: appConfig.theme.colors.primary[600],
                            }}
                        />
                    </Box>
                    {/* Formulário */}


                    {/* Photo Area */}
                    <Box
                        styleSheet={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            maxWidth: '200px',
                            padding: '16px',
                            backgroundColor: appConfig.theme.colors.neutrals[800],
                            border: '1px solid',
                            borderColor: appConfig.theme.colors.neutrals[999],
                            borderRadius: '10px',
                            flex: 1,
                            minHeight: '240px',
                        }}
                    >
                        <Image
                            styleSheet={{
                                borderRadius: '50%',
                                marginBottom: '16px',
                            }}
                            src={`https://github.com/${username}.png`}
                        />
                        <Text
                            variant="body4"
                            styleSheet={{
                                color: appConfig.theme.colors.neutrals[200],
                                backgroundColor: appConfig.theme.colors.neutrals[900],
                                padding: '3px 10px',
                                borderRadius: '1000px'
                            }}
                        >
                            {username}
                        </Text>
                    </Box>
                    {/* Photo Area */}
                </Box>
            </Box>
        </>
    );
}
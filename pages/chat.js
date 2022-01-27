import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React, { useEffect, useState } from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js';

export default function ChatPage() {
    const [mensagem, setMensagem] = useState('');
    const [listaDeMensagens, setListaDeMensagens] = useState([]);

    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMxNjYzOSwiZXhwIjoxOTU4ODkyNjM5fQ.QoxDkLiJ_ZUZT6w5duGQiwPMXqlloIjNo916V6RGKRE';
    const SUPABASE_URL = 'https://yvqnmszzgisvxernihyp.supabase.co';
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    useEffect(() => {
        supabaseClient
            .from('mensagens')
            .select('*')
            .order('id', { ascending: false }) // para que mostre as mensagens na ordem correta
            .then(({ data }) => {
                console.log(data);
                setListaDeMensagens(data);
            });
    }, []);

    const handleNovaMensagem = (novaMensagem) => {
        const mensagem = {
            // id: listaDeMensagens.length + 1 + '-' + novaMensagem, apagado por que o servidor cria o proprio id
            de: 'vanessametonini',
            texto: novaMensagem,
        };
        supabaseClient
            .from('mensagens')
            .insert([
                // tem que ser um objeto com os MESMOS CAMPOS que foram aplicados no supabase 
                mensagem
            ])
            .then(({ data }) => {
                setListaDeMensagens([
                    data[0],
                    ...listaDeMensagens
                ]);
            })
        setMensagem('');
    }
    const apagarItem = (id) => {
        let novaLista = listaDeMensagens.filter(obj => obj.id !== id);
        setListaDeMensagens(novaLista);
        // alterar os dados no servidor
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: appConfig.theme.colors.primary["000"],
                backgroundImage: `url(${appConfig.theme.background})`,
                backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'bottom right', backgroundBlendMode: 'multiply',
                color: appConfig.theme.colors.neutrals['000']
            }}
        >
            <Box
                styleSheet={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    boxShadow: '0 2px 10px 0 rgb(0 0 0 / 20%)',
                    borderRadius: '5px',
                    backgroundColor: appConfig.theme.colors.neutrals[700],
                    opacity: 0.95,
                    height: '100%',
                    maxWidth: '80%',
                    maxHeight: '95vh',
                    padding: '32px',
                }}
            >
                <Header />
                <Box
                    styleSheet={{
                        position: 'relative',
                        display: 'flex',
                        flex: 1,
                        height: '80%',
                        backgroundColor: appConfig.theme.colors.neutrals[600],
                        flexDirection: 'column',
                        borderRadius: '5px',
                        padding: '16px',
                    }}
                >

                    <MessageList mensagens={listaDeMensagens} apagarItem={apagarItem} />

                    <Box
                        as="form"
                        styleSheet={{
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        <TextField
                            value={mensagem}
                            onChange={(event) => {
                                setMensagem(event.target.value);
                            }}
                            onKeyPress={(event) => {
                                if (event.key === "Enter") {
                                    event.preventDefault();
                                    handleNovaMensagem(mensagem);
                                };

                            }}
                            placeholder="Insira sua mensagem aqui..."
                            type="textarea"
                            styleSheet={{
                                width: '100%',
                                border: '0',
                                resize: 'none',
                                borderRadius: '5px',
                                padding: '6px 8px',
                                backgroundColor: appConfig.theme.colors.neutrals[800],
                                marginRight: '12px',
                                color: appConfig.theme.colors.neutrals[200],
                            }}
                        />
                        <Button
                            label="Enviar"
                            colorVariant='positive'
                            onClick={() => { handleNovaMensagem(mensagem) }}
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

function Header() {
    return (
        <>
            <Box styleSheet={{ width: '100%', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} >
                <Text variant='heading5'>
                    Chat
                </Text>
                <Button
                    variant='tertiary'
                    colorVariant='neutral'
                    label='Logout'
                    href="/"
                />
            </Box>
        </>
    )
}

function MessageList(props) {
    const apagarItem = props.apagarItem;
    return (
        <Box
            tag="ul"
            styleSheet={{
                overflow: 'auto',
                display: 'flex',
                flexDirection: 'column-reverse',
                flex: 1,
                color: appConfig.theme.colors.neutrals["000"],
                marginBottom: '16px',
            }}
        >
            {props.mensagens.map((mensagem) => {
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            hover: {
                                backgroundColor: appConfig.theme.colors.neutrals[700],
                            }
                        }}
                    >
                        <Box
                            styleSheet={{
                                marginBottom: '8px',
                            }}
                        >

                            <Image
                                styleSheet={{
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                            />
                            <Button
                                label="x"
                                colorVariant='neutral'
                                styleSheet={{
                                    position: 'absolute',
                                    right: '20px',
                                }}
                                onClick={() => {
                                    apagarItem(mensagem.id);
                                }}
                            />
                            <Text tag="strong">
                                {mensagem.de}
                            </Text>
                            <Text
                                styleSheet={{
                                    fontSize: '10px',
                                    marginLeft: '8px',
                                    color: appConfig.theme.colors.neutrals[300],
                                }}
                                tag="span"
                            >
                                {(new Date().toLocaleDateString())}
                            </Text>
                        </Box>
                        {mensagem.texto}
                    </Text>
                );
            })}
        </Box>
    )
}
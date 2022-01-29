import { Box, Text, TextField, Image, Button } from '@skynexui/components';
import React, { useEffect, useState } from 'react';
import appConfig from '../config.json';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/router';
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzMxNjYzOSwiZXhwIjoxOTU4ODkyNjM5fQ.QoxDkLiJ_ZUZT6w5duGQiwPMXqlloIjNo916V6RGKRE';
const SUPABASE_URL = 'https://yvqnmszzgisvxernihyp.supabase.co';
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function escuteMensagensEmTempoReal(adicionaMensagem) {
    return supabaseClient
        .from('mensagens')
        .on('INSERT', (data) => {
            adicionaMensagem(data.new);
        })
        .subscribe();
    // para ativar o realtime, é necessário ativar a função dentro do supabase
    // vai em supabase.com -> sign in -> projeto -> database -> replication -> source
    // escolhe a(as) tabela(s) que se quer
}

export default function ChatPage() {
    const roteamento = useRouter();
    const usuarioLogado = roteamento.query.username;
    const [mensagem, setMensagem] = useState('');
    const [listaDeMensagens, setListaDeMensagens] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        supabaseClient
            .from('mensagens')
            .select('*')
            .order('id', { ascending: false }) // para que mostre as mensagens na ordem correta
            .then(({ data }) => {
                // console.log(data);
                setListaDeMensagens(data);
            });

        setLoading(false);

        escuteMensagensEmTempoReal((novaMensagem) => {
            // handleNovaMensagem(novaMensagem); -> infinite loop
            // passando uma função para uma função useState sempre recebe como parâmetro o valor atual da lista
            // nesse caso ilustrado pela variável valorAtualDaLista
            setListaDeMensagens((valorAtualDaLista) => {
                return [
                    novaMensagem,
                    ...valorAtualDaLista
                ]
            });
        });
    }, []);


    const handleNovaMensagem = async (novaMensagem) => {
        const mensagem = {
            // id: listaDeMensagens.length + 1 + '-' + novaMensagem, apagado por que o servidor cria o proprio id
            de: usuarioLogado,
            texto: novaMensagem,
        };
        try {
            await supabaseClient
                .from('mensagens')
                .insert([
                    // tem que ser um objeto com os MESMOS CAMPOS que foram aplicados no supabase 
                    mensagem
                ])
            // .then(({ data }) => {
            // função foi passada para a função acima, escutaMensagemEmTempoReal
            // setListaDeMensagens([
            //     data[0],
            //     ...listaDeMensagens
            // ]);
            // })
        } catch (error) {
            console.log(error);
        }
        setMensagem('');
    }

    const apagarItem = async (id) => {
        try {
            await supabaseClient.from('mensagens').delete().match({ id });
            setListaDeMensagens(listaDeMensagens.filter(obj => obj.id !== id))
        } catch (error) {
            console.log('error', error);
        }
    }

    return (
        <Box
            styleSheet={{
                display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
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
                    opacity: 0.90,
                    height: '100%',
                    maxWidth: '70%',
                    maxHeight: '95vh',
                    padding: '32px',
                    marginLeft: '15px'
                }}
            >
                {loading === true ? (
                    <Box
                        styleSheet={{
                            display: 'flex',
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%',
                        }}
                    >
                        <Text>Carregando...</Text>
                    </Box>
                ) : (
                    <>
                        <Header />
                        <Box
                            styleSheet={{
                                display: 'flex',
                                flex: 1,
                                height: '80%',
                                backgroundColor: appConfig.theme.colors.neutrals[600],
                                flexDirection: 'column',
                                borderRadius: '5px',
                                padding: '16px',
                            }}
                        >

                            <MessageList
                                mensagens={listaDeMensagens}
                                apagarItem={apagarItem}
                                usuarioLogado={usuarioLogado}
                            />

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
                                <ButtonSendSticker
                                    onStickerClick={(sticker) => {
                                        handleNovaMensagem(`:sticker:${sticker}`)
                                    }}
                                />

                                <Button
                                    label="Enviar"
                                    colorVariant='positive'
                                    onClick={() => {
                                        handleNovaMensagem(mensagem);
                                    }}
                                    styleSheet={{
                                        marginLeft: '10px',
                                        transform: 'translateY(-5px)'
                                    }}
                                />
                            </Box>
                        </Box>
                    </>
                )}
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
    const usuarioLogado = props.usuarioLogado || 'marandmart';
    const mensagens = props.mensagens;

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
            {mensagens.map((mensagem) => {
                return (
                    <Text
                        key={mensagem.id}
                        tag="li"
                        styleSheet={{
                            borderRadius: '5px',
                            padding: '6px',
                            marginBottom: '12px',
                            position: 'relative',
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
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '50%',
                                    display: 'inline-block',
                                    marginRight: '8px',
                                }}
                                src={`https://github.com/${mensagem.de}.png`}
                            />
                            {mensagem.de === usuarioLogado &&
                                <Button
                                    label="x"
                                    colorVariant='neutral'
                                    styleSheet={{
                                        position: 'absolute',
                                        right: '10px',
                                    }}
                                    onClick={() => {
                                        apagarItem(mensagem.id);
                                    }}
                                />
                            }
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
                        {mensagem.texto.startsWith(':sticker:')
                            ? (
                                <Image src={mensagem.texto.replace(':sticker:', '')}
                                    styleSheet={{
                                        maxWidth: '200px',
                                    }}
                                />
                            ) : (
                                mensagem.texto
                            )}
                    </Text>
                );
            })}
        </Box>
    )
}
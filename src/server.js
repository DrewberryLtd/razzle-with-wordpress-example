import App from './App';
import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import express from 'express';
import compression from 'compression';
import { renderToString } from 'react-dom/server';

import configureStore from './store/configureStore';
import { remoteLoader } from './api/remoteLoader';
import serialize from 'serialize-javascript';

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const server = express();
server.use(compression());

server
    .disable('x-powered-by')
    .use(express.static(process.env.RAZZLE_PUBLIC_DIR, { Expires: '30d' }))
    .use(function(req, res, next) {
        if (req.path.substr(-1) === '/' && req.path.length > 1) {
            let query = req.url.slice(req.path.length);
            res.redirect(301, req.path.slice(0, -1) + query);
        } else {
            next();
        }
    })
    .get('/*', (req, res) => {
        remoteLoader(apiResult => {
            const responseCode = typeof apiResult.status === 'undefined' ? 404 : apiResult.status;

            if (responseCode === 301) {
                return res.redirect(responseCode, apiResult.headers.location);
            }

            // Compile an initial state
            const initialState = {
                remote: {
                    cms: {
                        result: apiResult ? apiResult.data : false,
                        loading: false
                    }
                }
            };
            // Create a new Redux store instance
            const store = configureStore(initialState);

            const context = {};
            const markup = renderToString(
                <StaticRouter context={context} location={req.url}>
                    <Provider store={store}>
                        <App />
                    </Provider>
                </StaticRouter>
            );

            if (context.url) {
                res.redirect(context.url);
            } else {
                res.status(responseCode).send(
                    `<!doctype html>
                    <html>
                    <head>
                        ${assets.client.css ? `<link rel="stylesheet" href="${assets.client.css}">` : ''}
                    </head>
                    <body class="drewberry-preload">

                        <div id="root">${markup}</div>

                        <script>
                            window.__PRELOADED_STATE__ = ${serialize(initialState)}
                        </script>

                        <script src="${assets.client.js}" crossorigin></script>

                        <script> if (typeof window === 'object') window.main(); </script>

                    </body>
                </html>`
                );
            }
        }, req.path);
    });

export default server;
